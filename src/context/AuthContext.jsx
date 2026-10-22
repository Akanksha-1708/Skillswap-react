// createcontext cerates a global container, initially its empty
// authcontext.provider provides data to the entire app, Anything inside it can access the data.
// children, very imp react concept, React renders the entire application there.
// createContext(), Creates a global context object. Think of it like an empty locker.
// <AuthContext.Provider value={{}}> This is what fills the locker.
// useEffect => Without it, React would keep registering listeners on every render.
// onauthstatechanged => Whenever the authentication state changes, let me know.

// app starts->user already logged in->firebase says here is the user
// app starts->user logs out->firebase says no user now
// return unsubscribe => Removes the Firebase auth listener when the component unmounts, preventing memory leaks.


// AuthContext acts as the single source of truth for authentication and user profile.
//
// Why do we need refreshUserProfile()?
//
// When the app starts, AuthContext reads the user's profile from Firestore only once
// and stores it in Context. After the user edits their profile, Firestore is updated,
// but Context still contains the old data because it doesn't automatically know that
// the database has changed.
//
// refreshUserProfile() manually fetches the latest profile from Firestore and updates
// the Context. Since every component (Dashboard, Navbar, WelcomeCard, etc.) reads the
// profile from Context, they automatically re-render with the latest data without
// requiring a page refresh.
//
// Flow:
// App Starts
//      ↓
// Firestore → AuthContext → Entire App
//
// Profile Updated
//      ↓
// refreshUserProfile()
//      ↓
// Firestore → AuthContext → Entire App (Updated)

import {createContext,useContext,useEffect,useState} from "react";
import {auth} from "@/firebase/firebase";
import { onAuthStateChanged,signOut } from "firebase/auth";
import {doc,getDoc} from "firebase/firestore";
import {db} from "@/firebase/firebase";


const AuthContext=createContext();

export function useAuth(){
    return useContext(AuthContext);
}
export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);  //still checking with Firebase
    const refreshUserProfile = async (user) => {
    if (!user) {
    setUserProfile(null);
    return;
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    setUserProfile(docSnap.data());
    } else {
    setUserProfile(null);
    }
    };
    
    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,async (user)=>{
            setCurrentUser(user);
            await refreshUserProfile(user);
            setLoading(false);
        });
        return unsubscribe;
    },[]);

    const logout=async()=>{
        setUserProfile(null);
        await signOut(auth);
    }
    // While Firebase is still checking whether someone is logged in,
    // show a loader instead of a blank white screen.
    if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#081E4C]">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
        </div>
    );
    }

    return(
        <AuthContext.Provider value={{currentUser,userProfile,logout,refreshUserProfile,}}>
            {children}
        </AuthContext.Provider>
    );
}