import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getUserWorkspaces } from "@/utils/workspaceService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

function ContinueLearning() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const workspaceList = await getUserWorkspaces(currentUser);

      workspaceList.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;

        return (
          b.createdAt.toDate().getTime() -
          a.createdAt.toDate().getTime()
        );
      });

      setWorkspaces(workspaceList.slice(0, 3));
    };

    fetchWorkspaces();
  }, [currentUser]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h2 className="text-3xl font-bold text-white">
        Continue Learning
      </h2>

      <p className="mt-2 text-slate-300">
        Resume your active learning workspaces.
      </p>

      <div className="mt-8 space-y-4">

        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div>

                <h3 className="text-xl font-semibold text-white">
                  {workspace.partner?.displayName ||
                    workspace.partner?.fullName ||
                    workspace.partner?.name ||
                    "Deleted User"}
                </h3>

                <p className="mt-1 text-slate-400">
                  Status:{" "}
                  <span className="text-green-400">
                    {workspace.status}
                  </span>
                </p>

                {workspace.createdAt && (
                  <p className="text-sm text-slate-500">
                    Created{" "}
                    {formatDistanceToNow(
                      workspace.createdAt.toDate(),
                      { addSuffix: true }
                    )}
                  </p>
                )}

              </div>

              <Button
                onClick={() =>
                  navigate(`/workspace/${workspace.id}`)
                }
                className="bg-blue-500 hover:bg-blue-600"
              >
                Resume Workspace
              </Button>

            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">

            <h3 className="text-xl font-semibold text-white">
              No Active Workspace
            </h3>

            <p className="mt-2 text-slate-400">
              Start learning with someone by sending a skill swap request.
            </p>

            <Button
              onClick={() => navigate("/skills")}
              className="mt-6 bg-blue-500 hover:bg-blue-600"
            >
              Browse Skills
            </Button>

          </div>
        )}

      </div>

    </div>
  );
}

export default ContinueLearning;