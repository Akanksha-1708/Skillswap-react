

import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/firebaseErrors";

function Signup() {
const [showPassword, setShowPassword] = useState(false);

const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  password: "",
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const navigate = useNavigate();
const handleSignup = async () => {
  try {
    await createUserWithEmailAndPassword(
      auth,
      formData.email.trim(),
      formData.password
    );

    toast.success("Account created! Let's set up your profile.");

    navigate("/profile-setup");

  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793] px-6">

      <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">


        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block">

          <h1 className="text-6xl font-extrabold leading-tight text-white">
            Create Your
            <br />
            Account 🚀
          </h1>

          <p className="mt-8 text-xl leading-8 text-slate-300">
            Join thousands of learners exchanging
            knowledge across the world.
          </p>

        </motion.div>

        <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/10 bg-white/10 p-10 backdrop-blur-xl">

          <h2 className="text-4xl font-bold text-white">
            Create Account
          </h2>

          <p className="mt-3 text-slate-300">
            Start your SkillSwap journey today.
          </p>

          <div className="mt-8">

            <label className="mb-2 block text-slate-200">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-500"/>

          </div>

          <div className="mt-8">

            <label className="mb-2 block text-slate-200">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
            />

          </div>

          <div className="mt-6">

            <label className="mb-2 block text-slate-200">
              Password
            </label>

            <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-500"/>

            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">

            {showPassword?<EyeOff size={20}/>:<Eye size={20}/>}
            </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-slate-300">

              <input type="checkbox" />

              Remember me

            </label>

            <button className="text-blue-400 hover:underline">
              Forgot Password?
            </button>

          </div>

          <Button onClick={handleSignup} className="mt-8 h-12 w-full rounded-xl bg-blue-500 text-lg hover:bg-blue-600">
            Create Account
          </Button>

          <div className="my-8 flex items-center">

            <div className="h-px flex-1 bg-white/10"></div>

            <span className="mx-4 text-slate-400">
              OR
            </span>

            <div className="h-px flex-1 bg-white/10"></div>

          </div>

          <Button
            variant="outline"
            className="h-12 w-full gap-3 border-white/20 bg-white/10 text-white hover:bg-white/20">
            <FcGoogle size={22} />
            Sign up with Google
          </Button>

          <p className="mt-8 text-center text-slate-300">

            Already have an account?

            <Link to="/login" className="font-semibold text-blue-400 hover:underline">
            Login
            </Link>

          </p>

        </motion.div>

      </div>

    </div>
  );
}

export default Signup;