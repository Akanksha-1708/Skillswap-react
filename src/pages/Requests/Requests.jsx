// Requests displays all incoming skill swap requests.
//
// Unlike BrowseSkills, which fetches user profiles,
// this page fetches swap request documents where
// the logged-in user is the receiver.
//
// Flow:
//
// Firestore
//       ↓
// swapRequests
//       ↓
// Query by toUser
//       ↓
// React State
//       ↓
// Request Cards

// This page represents the user's inbox for skill swap requests.
// Firestore performs the filtering, so only relevant requests are downloaded instead of the entire collection.
// Child components cannot directly change the parent's state.
// Instead, the parent passes a callback function to the child.
// When the child finishes updating Firestore (Accept/Reject),
// it calls the callback.
import RequestCard from "@/components/Requests/RequestCard";
import {useEffect,useState} from "react";
import {collection,getDocs,query,where} from "firebase/firestore";
import {db} from "@/firebase/firebase";
import {useAuth} from "@/context/AuthContext";

function Requests() {
    const [requests, setRequests] = useState([]);
    const { currentUser } = useAuth();

const handleStatusChange = (requestId) => {
    setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
    );
};

    // The fetch lives inside the effect so React can see exactly what it depends on.
    // "ignore" stops a late Firestore reply from updating an unmounted page.
    useEffect(()=>{
        if(!currentUser) return;
        let ignore=false;

        const fetchRequests = async () => {
            const q = query(
                collection(db, "swapRequests"),
                where("toUser", "==", currentUser.uid),
                where("status", "==", "pending")
            );

            const snapshot = await getDocs(q);
            if(ignore) return;

            const requestList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setRequests(requestList);
        };

        fetchRequests();
        return ()=>{ignore=true;};
    },[currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793] px-6 py-10">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-5xl font-bold text-white">
          Incoming Requests
        </h1>

        <p className="mt-3 text-slate-300">
          Review skill swap requests sent to you.
        </p>

        <div className="mt-10 space-y-6">
            {requests.map(request=>(
                <RequestCard
                key={request.id}
                request={request}
                onStatusChange={handleStatusChange}
                />
            ))}
            {requests.length===0&&(
                <div className="rounded-3xl border-white/10 bg-white/5 p-8 text-center text-slate-300 backdrop-blur-xl">
                    No incoming requests yet.
                    </div>
            )}
        </div>

      </div>

    </div>
  );
}

export default Requests;