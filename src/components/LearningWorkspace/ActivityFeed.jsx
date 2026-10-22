import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
} from "firebase/firestore";

function ActivityFeed({ workspaceId }) {

    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, "workspaceActivities"),
            where("workspaceId", "==", workspaceId),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activityList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setActivities(activityList);
        });
        return () => unsubscribe();
    }, [workspaceId]);
    return (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-3xl font-bold text-white">
                Activity Feed
            </h2>
            {activities.length === 0 ? (
                <p className="mt-4 text-slate-400">
                    No activity yet.
                </p>
            ) : (
                <div className="mt-6 space-y-4">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="rounded-xl border border-white/10 bg-[#1A2E66] p-4">
                            <p className="text-white">
                                <span className="font-semibold">
                                    {activity.userName}
                                </span>{" "}
                                {activity.message}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                {activity.type}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ActivityFeed;