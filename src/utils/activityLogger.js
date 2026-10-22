import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// Records one entry in the workspace activity feed.
// A failure here should never block the user's real action (adding a task,
// saving notes, ...), so errors are caught and only reported to the console.
export async function addActivity({
    workspaceId,
    userId,
    userName,
    type,
    message,
}) {
    try {
        await addDoc(
            collection(db, "workspaceActivities"),
            {
                workspaceId,
                userId,
                userName,
                type,
                message,
                createdAt: serverTimestamp(),
            }
        );
    } catch (error) {
        console.error("Activity failed:", error);
    }
}
