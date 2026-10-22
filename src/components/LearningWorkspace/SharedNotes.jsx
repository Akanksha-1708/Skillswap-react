import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { addActivity } from "@/utils/activityLogger";
import {
    collection,
    addDoc,
    query,
    where,
    serverTimestamp,
    updateDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

function SharedNotes({ workspaceId }) {
    
    const [notes, setNotes] = useState("");
    const [noteId, setNoteId] = useState(null);
    const { currentUser, userProfile } = useAuth();

useEffect(() => {
    const q = query(
        collection(db, "workspaceNotes"),
        where("workspaceId", "==", workspaceId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
            const note = snapshot.docs[0];
            setNoteId(note.id);
            setNotes(note.data().text);
        }
    });
    return () => unsubscribe();
}, [workspaceId]);

const saveNotes = async () => {

    if (noteId) {
        await updateDoc(
            doc(db, "workspaceNotes", noteId),
            {
                text: notes,
                updatedAt: serverTimestamp(),
            }
        );
        await addActivity({
            workspaceId,
            userId: currentUser.uid,
            userName: userProfile?.fullName || "Unknown User",
            type: "note",
            message: "updated shared notes",
        });
    } else {
        await addDoc(
            collection(db, "workspaceNotes"),
            {
                workspaceId,
                text: notes,
                updatedAt: serverTimestamp(),
            }
        );
        await addActivity({
            workspaceId,
            userId: currentUser.uid,
            userName: userProfile?.fullName || "Unknown User",
            type: "note",
            message: "created shared notes",
        });
    }
    toast.success("Notes saved!");
};
    return (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-3xl font-bold text-white">
                Shared Notes
            </h2>
            <p className="mt-2 text-slate-300">
                Both learners can write and update these notes.
            </p>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write today's learning notes..."
                className="mt-6 h-64 w-full rounded-2xl border border-white/10 bg-[#1A2E66] p-5 text-white outline-none"/>
            <button
                onClick={saveNotes}
                className="mt-6 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600">
                Save Notes
            </button>
        </div>
    );
}

export default SharedNotes;