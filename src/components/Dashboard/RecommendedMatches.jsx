import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecommendedMatches() {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Recommended Matches
          </h2>

          <p className="mt-2 text-slate-300">
            Discover learners whose skills and interests align with yours.
          </p>
        </div>

        <div className="rounded-2xl bg-blue-500/20 p-4">
          <Users className="text-blue-400" size={32} />
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-2xl font-semibold text-white">
          Find Your Next Learning Partner
        </h3>

        <p className="mt-3 text-slate-300 leading-relaxed">
          Our recommendation system analyzes your teaching skills and learning
          goals to suggest compatible learners. Explore personalized matches and
          start collaborating.
        </p>

        <Button
          onClick={() => navigate("/ai-matches")}
          className="mt-8 bg-blue-500 hover:bg-blue-600"
        >
          Explore AI Matches
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default RecommendedMatches;