import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getUserWorkspaces } from "@/utils/workspaceService";

function MyWorkspaces() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const workspaceList = await getUserWorkspaces(currentUser);
      setWorkspaces(workspaceList);
    };

    fetchWorkspaces();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793] px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-5xl font-bold text-white">
          My Workspaces
        </h1>

        <p className="mt-3 text-slate-300">
          Access all your active learning workspaces.
        </p>

        <div className="mt-10 space-y-6">

          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <h2 className="text-2xl font-semibold text-white">
                {workspace.partner?.displayName ||
                  workspace.partner?.fullName ||
                  workspace.partner?.name ||
                  "Deleted User"}
              </h2>

              <p className="mt-2 text-slate-300">
                {workspace.partner?.email || "Email unavailable"}
              </p>

              <p className="mt-4 text-slate-300">
                Status:
                <span
                  className={`ml-2 font-semibold ${
                    workspace.status === "active"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {workspace.status}
                </span>
              </p>

              <button
                onClick={() => navigate(`/workspace/${workspace.id}`)}
                className="mt-6 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
              >
                Open Workspace
              </button>
            </div>
          ))}

          {workspaces.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300 backdrop-blur-xl">
              You don't have any workspaces yet.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MyWorkspaces;