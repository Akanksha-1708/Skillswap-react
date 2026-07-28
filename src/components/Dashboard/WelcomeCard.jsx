// Using Context to access the logged-in user anywhere in your app.
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

function WelcomeCard() {
  const { currentUser, userProfile } = useAuth();

  const hour = new Date().getHours();

  let greeting = "Welcome";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <h1 className="text-4xl font-bold text-white">
        {greeting},
        <span className="text-blue-400">
          {" "}
          {userProfile?.fullName ||
            currentUser?.displayName ||
            "Learner"}{" "}
          👋
        </span>
      </h1>

      <p className="mt-4 text-lg text-slate-300">
        {currentUser?.email}
      </p>

      <p className="mt-6 max-w-2xl text-slate-400">
        {userProfile?.bio ||
          "Continue your learning journey, connect with new mentors, and exchange skills with the SkillSwap community."}
      </p>

      <div className="mt-8 flex flex-wrap gap-4">

        <Link
          to="/skills"
          className="inline-flex h-11 items-center rounded-xl bg-blue-500 px-6 font-semibold text-white transition hover:bg-blue-600"
        >
          Browse Skills
        </Link>

        <Link
          to="/my-workspaces"
          className="inline-flex h-11 items-center rounded-xl bg-blue-500 px-6 font-semibold text-white transition hover:bg-blue-600"
        >
          My Workspaces
        </Link>

        <Link
          to="/requests"
          className="inline-flex h-11 items-center rounded-xl bg-blue-500 px-6 font-semibold text-white transition hover:bg-blue-600"
        >
          Incoming Requests
        </Link>

        <Link
          to="/edit-profile"
          className="inline-flex h-11 items-center rounded-xl border border-blue-500 px-6 font-semibold text-blue-300 transition hover:bg-blue-500/10"
        >
          Edit Profile
        </Link>

      </div>
    </motion.div>
  );
}

export default WelcomeCard;