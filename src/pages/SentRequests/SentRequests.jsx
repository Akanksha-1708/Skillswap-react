// SentRequests displays every request sent by the logged-in user.
//
// Unlike Incoming Requests, which query requests where the user
// is the receiver (toUser), this page queries requests where the
// user is the sender (fromUser).
//
// Flow:
//
// Firestore
//      ↓
// swapRequests
//      ↓
// Query by fromUser
//      ↓
// React State
//      ↓
// SentRequestCard
//
// The sender can track whether each request is
// Pending, Accepted or Rejected.

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/AuthContext";

import SentRequestCard from "@/components/Requests/SentRequestCard";

function SentRequests() {
  const { currentUser } = useAuth();

  const [requests, setRequests] = useState([]);

  // The fetch lives inside the effect so React can see exactly what it depends on.
  // "ignore" stops a late Firestore reply from updating an unmounted page.
  useEffect(() => {
    if (!currentUser) return;
    let ignore = false;

    const fetchRequests = async () => {
      const q = query(
        collection(db, "swapRequests"),
        where("fromUser", "==", currentUser.uid)
      );

      const snapshot = await getDocs(q);
      if (ignore) return;

      const requestList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(requestList);
    };

    fetchRequests();
    return () => {
      ignore = true;
    };
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793] px-6 py-10">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-5xl font-bold text-white">
          Sent Requests
        </h1>

        <p className="mt-3 text-slate-300">
          Track the status of every skill swap request you've sent.
        </p>

        <div className="mt-10 space-y-6">

          {requests.map((request) => (
            <SentRequestCard
              key={request.id}
              request={request}
            />
          ))}

          {requests.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300 backdrop-blur-xl">
              You haven't sent any requests yet.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default SentRequests;