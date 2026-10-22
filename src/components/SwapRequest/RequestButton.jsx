// RequestButton creates a new skill swap request between two users.
//
// User profiles store personal information.
// Swap requests represent relationships between users.
//
// Keeping requests in a separate collection avoids duplicating data
// and allows one user to send or receive multiple requests.

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/firebaseErrors";

import {
    addDoc,
    collection,
    serverTimestamp,
    getDocs,
    query,
    where,
    doc,
    getDoc,
} from "firebase/firestore";

function RequestButton({ receiver }) {

    const { currentUser, userProfile } = useAuth();

    const handleRequest = async () => {
        try {

            const q = query(
                collection(db, "swapRequests"),
                where("fromUser", "==", currentUser.uid),
                where("toUser", "==", receiver.uid),
                where("status", "==", "pending")
            );

            const existingRequest = await getDocs(q);

            if (!existingRequest.empty) {
                toast.info("You have already sent a request to this user.");
                return;
            }

            await addDoc(
                collection(db, "swapRequests"),
                {
                    fromUser: currentUser.uid,
                    toUser: receiver.uid,

                    senderTeachingSkills: userProfile.teachingSkills,
                    senderLearningSkills: userProfile.learningSkills,

                    receiverTeachingSkills: receiver.teachingSkills,
                    receiverLearningSkills: receiver.learningSkills,

                    workspaceId: null,

                    status: "pending",

                    createdAt: serverTimestamp(),
                }
            );

            const senderDoc = await getDoc(
                doc(db, "users", currentUser.uid)
            );

            const senderName = senderDoc.exists()
                ? senderDoc.data().fullName
                : "Someone";

            await addDoc(
                collection(db, "notifications"),
                {
                    userId: receiver.uid,

                    type: "request",

                    title: "New Skill Swap Request",

                    message: `${senderName} sent you a skill swap request.`,

                    isRead: false,

                    createdAt: serverTimestamp(),

                    link: "/requests",
                }
            );

            toast.success("Request sent!");

        } catch (error) {

            console.error(error);
            toast.error(getErrorMessage(error));

        }

    };

    return (
        <Button
            onClick={handleRequest}
            className="mt-10 h-12 w-full bg-blue-500 hover:bg-blue-600"
        >
            Request Skill Swap
        </Button>
    );

}

export default RequestButton;