import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function AIMatches() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/recommendations/${currentUser.uid}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch AI recommendations");
        }

        const data = await response.json();

        setMatches(data.recommendations || []);
      } catch (error) {
        console.error("AI recommendation error:", error);
        setError(
          "Unable to load AI recommendations. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793] px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-5xl font-bold text-white">
          AI Recommended Matches
        </h1>

        <p className="mt-3 text-slate-300">
          AI-powered recommendations based on your teaching and learning
          skills.
        </p>

        {/* Loading */}
        {loading && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300 backdrop-blur-xl">
            Finding your best skill matches...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-center text-red-300 backdrop-blur-xl">
            {error}
          </div>
        )}

        {/* Recommendations */}
        {!loading && !error && (
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
                      {user.fullName || "SkillSwap User"}
                    </h2>

                    <p className="mt-1 text-slate-300">
                      {user.email}
                    </p>
                  </div>

                  {/* AI Score */}
                  <div
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      user.score >= 50
                        ? "bg-green-500/20 text-green-400"
                        : user.score >= 20
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    🤖 {user.score}% AI Match
                  </div>

                </div>

                {/* AI Match Breakdown */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      Can teach you
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-400">
                      {user.learningMatch}%
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Your learning ↔ their teaching
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">
                      Can learn from you
                    </p>

                    <p className="mt-1 text-xl font-bold text-blue-400">
                      {user.teachingMatch}%
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Your teaching ↔ their learning
                    </p>
                  </div>

                </div>

                {/* Skills */}
                <div className="mt-6 grid gap-6 md:grid-cols-2">

                  {/* Teaching */}
                  <div>
                    <h3 className="font-semibold text-blue-300">
                      Can Teach
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {user.teachingSkills?.length > 0 ? (
                        user.teachingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          No teaching skills listed
                        </span>
                      )}

                    </div>
                  </div>

                  {/* Learning */}
                  <div>
                    <h3 className="font-semibold text-green-300">
                      Wants To Learn
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {user.learningSkills?.length > 0 ? (
                        user.learningSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          No learning skills listed
                        </span>
                      )}

                    </div>
                  </div>

                </div>

                {/* Details */}
                <div className="mt-6 flex flex-wrap gap-8 text-slate-300">

                  <p>
                    <span className="font-semibold text-white">
                      Experience:
                    </span>{" "}
                    {user.experience || "Not specified"}
                  </p>

                  <p>
                    <span className="font-semibold text-white">
                      Availability:
                    </span>{" "}
                    {user.availability || "Not specified"}
                  </p>

                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    navigate(`/profile/${user.uid}`)
                  }
                  className="mt-8 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
                >
                  View Profile
                </button>

              </div>
            ))}

            {matches.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300 backdrop-blur-xl">
                No AI matches found yet. Try adding more teaching and
                learning skills to your profile.
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default AIMatches;