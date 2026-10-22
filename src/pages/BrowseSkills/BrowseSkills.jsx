// BrowseSkills is responsible for fetching, storing, searching, and displaying
// all user profiles.
//
// Firestore Flow:
// Firestore (users collection)
//        ↓
// getDocs()
//        ↓
// Array of user objects
//        ↓
// React State (users)
//        ↓
// users.map()
//        ↓
// UserCard rendered for every user
//
// Search Architecture (Lifting State Up):
// The search text is stored in BrowseSkills instead of SearchBar because
// SearchBar only collects user input, while BrowseSkills owns the user list
// and performs filtering.
//
// Flow:
// User Types
//        ↓
// SearchBar
//        ↓
// setSearchTerm()
//        ↓
// BrowseSkills updates search state
//        ↓
// Filters users
//        ↓
// UserCards automatically re-render
//
// Why?
// The parent component owns the shared state so multiple child components
// can access and react to the same data. This React pattern is called
// "Lifting State Up".

// Search works by filtering the users array stored in React state.
//
// filter() creates a new array containing only users that satisfy the condition.
// includes() checks whether a teaching or learning skill contains the search text.
//
// Since filtering is done on the already-fetched data, no additional Firestore
// requests are made while typing. React automatically re-renders whenever
// searchTerm changes.

import SearchBar from "@/components/BrowseSkills/SearchBar";
import UserCard from "@/components/BrowseSkills/UserCard";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/AuthContext";

function BrowseSkills(){
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    // The fetch function lives inside the effect, so the effect is self-contained.
    // "ignore" prevents a state update if the component unmounts before Firestore replies.
    useEffect(()=>{
        let ignore=false;
        const fetchUsers=async()=>{
            const snapshot=await getDocs(
                collection(db,"users")
            );
            if(ignore) return;
            const usersList=snapshot.docs.map(doc=>({
                id:doc.id,
                ...doc.data(),
            }));
            setUsers(usersList);
        };
        fetchUsers();
        return ()=>{ignore=true;};
    },[]);

    const filteredUsers = users.filter((user) => {
        if(user.uid===currentUser?.uid){
            return false;
        }
    const search = searchTerm.toLowerCase();

    const nameMatch = user.fullName
    ?.toLowerCase()
    .includes(search);

    const bioMatch = user.bio
    ?.toLowerCase()
    .includes(search);

    const teaches = user.teachingSkills?.some((skill) =>
    skill.toLowerCase().includes(search)
    );

    const learns = user.learningSkills?.some((skill) =>
    skill.toLowerCase().includes(search)
    );

    return nameMatch || bioMatch || teaches || learns;
    });
    return(
        <div className="min-h-screen bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793] px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-5xl font-bold text-white">
                    Browse Skills
                </h1>
                <p className="mt-3 text-slate-300">
                    Discover talented learners and mentors across SkillSwap.
                </p>
                <div className="mt-10">
                    <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}/>
                </div>
                    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredUsers.map(user=>(
                            <UserCard key={user.id} user={user}/>
                        ))}
                        {filteredUsers.length === 0 && (
                        <div className="col-span-full py-12 text-center text-lg text-slate-300">
                        No users found.
                        </div>
                        )}
                </div>
            </div>
        </div>
    );
}
export default BrowseSkills;