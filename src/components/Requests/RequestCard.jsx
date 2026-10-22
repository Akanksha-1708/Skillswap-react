// RequestCard displays the sender's profile information.
//
// A swap request stores only the sender's UID (fromUser).
// To display meaningful information, we fetch the sender's
// document from the users collection using getDoc().
//
// Flow:
//
// swapRequest
//       ↓
// fromUser UID
//       ↓
// users collection
//       ↓
// getDoc()
//       ↓
// Sender Profile
//       ↓
// Render name, bio and skills
//
// This pattern is called a manual join because Firestore
// does not support SQL JOIN operations.
// Accepting or rejecting a request does not create a new document.

// Instead, we update the existing Firestore document by changing its status field.

// This follows CRUD operations:
// Create  -> addDoc()
// Read    -> getDoc()/getDocs()
// Update  -> updateDoc()
// Delete  -> deleteDoc() (later)

import { useEffect, useState } from "react";
import {
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/firebaseErrors";

function RequestCard({ request, onStatusChange }) {

    const [sender, setSender] = useState(null);

    useEffect(() => {

        const fetchSender = async () => {

            const docRef = doc(
                db,
                "users",
                request.fromUser
            );

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setSender(docSnap.data());
            }

        };

        fetchSender();

    }, [request]);

    const updateStatus = async (status) => {

        try {

            if (status === "accepted") {

                const workspaceRef = await addDoc(
                    collection(db, "learningWorkspaces"),
                    {
                        requestId: request.id,

                        participants: [
                            request.fromUser,
                            request.toUser,
                        ],

                        senderTeachingSkills: request.senderTeachingSkills,
                        senderLearningSkills: request.senderLearningSkills,

                        receiverTeachingSkills: request.receiverTeachingSkills,
                        receiverLearningSkills: request.receiverLearningSkills,

                        status: "active",

                        createdAt: serverTimestamp(),
                    }
                );

                await updateDoc(
                    doc(db, "swapRequests", request.id),
                    {
                        status: "accepted",
                        workspaceId: workspaceRef.id,
                    }
                );

            } else {

                await updateDoc(
                    doc(db, "swapRequests", request.id),
                    {
                        status,
                    }
                );

            }

            toast.success(
                status === "accepted"
                    ? "Request accepted. A learning workspace has been created."
                    : "Request rejected."
            );

            onStatusChange(request.id);

        } catch (error) {

            console.error("Failed to update request:", error);
            toast.error(getErrorMessage(error));

        }

    };

    // ✅ IMPORTANT: Don't remove this.
    if (!sender) {
        return (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-xl">
                Loading...
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

            <h2 className="text-2xl font-bold text-white">
                {sender.fullName}
            </h2>

            <p className="mt-3 text-slate-300">
                {sender.bio}
            </p>

            <p className="mt-4 text-blue-400">
                Teaching:
            </p>

            <p className="text-white">
                {sender.teachingSkills.join(", ")}
            </p>

            <div className="mt-8 flex gap-4">

                <button
                    onClick={() => updateStatus("accepted")}
                    className="rounded-xl bg-green-500 px-6 py-3 text-white"
                >
                    Accept
                </button>

                <button
                    onClick={() => updateStatus("rejected")}
                    className="rounded-xl bg-red-500 px-6 py-3 text-white"
                >
                    Reject
                </button>

            </div>

        </div>
    );
}

export default RequestCard;