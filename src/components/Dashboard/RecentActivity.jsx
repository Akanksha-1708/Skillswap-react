import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  StickyNote,
  BookOpen,
  ClipboardList,
} from "lucide-react";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { formatDistanceToNow } from "date-fns";

function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const q = query(
        collection(db, "workspaceActivities"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const snapshot = await getDocs(q);

      const activityList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setActivities(activityList);
    };

    fetchActivities();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "task":
        return <CheckCircle2 className="text-green-400" size={24} />;

      case "note":
        return <StickyNote className="text-yellow-400" size={24} />;

      case "resource":
        return <BookOpen className="text-purple-400" size={24} />;

      case "session":
        return <ClipboardList className="text-pink-400" size={24} />;

      default:
        return <Clock className="text-blue-400" size={24} />;
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h2 className="text-3xl font-bold text-white">
        Recent Activity
      </h2>

      <p className="mt-2 text-slate-300">
        Stay updated with the latest learning progress.
      </p>

      <div className="mt-8 space-y-5">

        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-white/10 p-3">
                  {getIcon(activity.type)}
                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    {activity.userName}
                  </h3>

                  <p className="text-sm text-slate-300">
                    {activity.message}
                  </p>

                  <p className="mt-1 text-xs text-slate-400 capitalize">
                    {activity.type}
                  </p>

                  {activity.createdAt && (
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(
                        activity.createdAt.toDate(),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  )}

                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">

            <Clock
              className="mx-auto mb-4 text-slate-400"
              size={40}
            />

            <h3 className="text-xl font-semibold text-white">
              No Recent Activity
            </h3>

            <p className="mt-2 text-slate-400">
              Start collaborating in a workspace to see your activity here.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default RecentActivity;