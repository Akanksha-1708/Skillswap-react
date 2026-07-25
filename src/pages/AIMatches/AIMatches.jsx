import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/AuthContext";
import { calculateMatchScore } from "@/utils/matchEngine";
import { useNavigate } from "react-router-dom";

function AIMatches() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!currentUser) return;

      // Fetch all users from Firestore
      const snapshot = await getDocs(collection(db, "users"));

      const users = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      // Logged-in user's Firestore profile
      const loggedInUser = users.find(
        (user) => user.uid === currentUser.uid
      );

      if (!loggedInUser) return;

      // Remove yourself from recommendations
      const otherUsers = users.filter(
        (user) => user.uid !== currentUser.uid
      );

      // Calculate scores
      const recommendations = otherUsers.map((user) => ({
        ...user,
        score: calculateMatchScore(loggedInUser, user),
      })).filter((user)=>user.score>0);

      // Sort by highest score
      recommendations.sort((a, b) => b.score - a.score);

      setMatches(recommendations);
    };

    fetchMatches();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793] px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-5xl font-bold text-white">
          Recommended Matches
        </h1>

        <p className="mt-3 text-slate-300">
          Find learners and mentors who best match your skills.
        </p>

        <div className="mt-10 space-y-6">

          {matches.map((user) => (
            <div
              key={user.uid}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {user.fullName}
                  </h2>

                  <p className="mt-1 text-slate-300">
                    {user.email}
                  </p>
                </div>

                <div
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    user.score >= 50
                      ? "bg-green-500/20 text-green-400"
                      : user.score >= 20
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  ⭐ {user.score}% Match
                </div>

              </div>

              {/* Skills */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">

                <div>
                  <h3 className="font-semibold text-blue-300">
                    Can Teach
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {user.teachingSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-green-300">
                    Wants To Learn
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {user.learningSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Details */}
              <div className="mt-6 flex flex-wrap gap-8 text-slate-300">

                <p>
                  <span className="font-semibold text-white">
                    Experience:
                  </span>{" "}
                  {user.experience}
                </p>

                <p>
                  <span className="font-semibold text-white">
                    Availability:
                  </span>{" "}
                  {user.availability}
                </p>

              </div>

              {/* Button */}
              <button
                onClick={() => navigate(`/profile/${user.uid}`)}
                className="mt-8 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
              >
                View Profile
              </button>

            </div>
          ))}

          {matches.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300 backdrop-blur-xl">
              No suitable matches found yet. Try updating your skills to improve recommendations.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AIMatches;