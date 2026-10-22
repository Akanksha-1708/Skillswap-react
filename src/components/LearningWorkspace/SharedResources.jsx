import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";

import {
    collection,
    addDoc,
    query,
    where,
    serverTimestamp,
    onSnapshot,
} from "firebase/firestore";
import { addActivity } from "@/utils/activityLogger";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

function SharedResources({ workspaceId }) {

    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [resources, setResources] = useState([]);
    const { currentUser, userProfile } = useAuth();

    useEffect(() => {
        const q = query(
            collection(db, "workspaceResources"),
            where("workspaceId", "==", workspaceId)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setResources(data);
        });
        return () => unsubscribe();
    }, [workspaceId]);
    const addResource = async () => {
        if (!title.trim() || !link.trim()) {
            toast.warn("Please enter both a title and a link.");
            return;
        }
        await addDoc(
            collection(db, "workspaceResources"),
            {
                workspaceId,
                title,
                link,
                createdAt: serverTimestamp(),
            }
        );
        await addActivity({
            workspaceId,
            userId:currentUser.uid,
            userName:userProfile.fullName||"Unknown User",
            type:"resource",
            message:"added a new resource",
        });
        setTitle("");
        setLink("");
    };

    return (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-3xl font-bold text-white">
                Shared Resources
            </h2>
            <p className="mt-2 text-slate-300">
                Save useful learning resources for both learners.
            </p>
            <input
                type="text"
                placeholder="Resource Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-6 w-full rounded-xl border border-white/10 bg-[#1A2E66] p-4 text-white outline-none"/>
            <input
                type="text"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="mt-4 w-full rounded-xl border border-white/10 bg-[#1A2E66] p-4 text-white outline-none"/>
            <button
                onClick={addResource}
                className="mt-5 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600">
                Add Resource
            </button>
            <div className="mt-8 space-y-4">
                {resources.map((resource) => (
                    <div
                        key={resource.id}
                        className="rounded-xl bg-white/5 p-5">
                        <h3 className="font-semibold text-white">
                            {resource.title}
                        </h3>
                        <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline break-all">
                            {resource.link}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SharedResources;