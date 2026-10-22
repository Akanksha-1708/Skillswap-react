import { useNavigate } from "react-router-dom";
import { Settings, User, Lock, Trash2, Info } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth,db } from "@/firebase/firebase";
import { deleteUser } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/firebaseErrors";
function SettingsPage() {

  const navigate = useNavigate();
  const handleChangePassword=async()=>{
    try{
        if(!auth.currentUser?.email){
            toast.error("No user is currently signed in.")
            return;
        }
        await sendPasswordResetEmail(auth,auth.currentUser.email);
        toast.success(`Password reset email sent to ${auth.currentUser.email}. Please check your inbox.`)
    }catch(error){
        console.error(error);
        toast.error(getErrorMessage(error))
    }
  };

  const handleDeleteAccount=async()=>{
    const confirmDelete=window.confirm(
        "Are you sure?\n\nThis action cannot be undone."
    )
    if(!confirmDelete)return;
    try{
        const user=auth.currentUser
        if(!user){
            toast.error("No authenticated user found.")
            return;
        }
        await deleteDoc(doc(db,"users",user.uid))
        await deleteUser(user)
        toast.success("Account deleted successfully.")
        navigate("/")
    }catch(error){
        console.error(error)
        toast.error(getErrorMessage(error))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081E4C] via-[#233E88] to-[#475793] px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10 flex items-center gap-4">
          <Settings className="h-10 w-10 text-blue-400" />
          <h1 className="text-5xl font-bold text-white">
            Settings
          </h1>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <User className="text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">
              Profile
            </h2>
          </div>

          <p className="mt-3 text-slate-300">
            Edit your profile information.
          </p>

          <button
            onClick={() => navigate("/edit-profile")}
            className="mt-5 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600">
            Edit Profile
          </button>

        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <Lock className="text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">
              Security
            </h2>
          </div>

          <p className="mt-3 text-slate-300">
            Change your account password.
          </p>

          <button
          onClick={handleChangePassword}
            className="mt-5 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600">
            Change Password
          </button>

        </div>

        <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <Trash2 className="text-red-400" />
            <h2 className="text-2xl font-semibold text-white">
              Account
            </h2>
          </div>

          <p className="mt-3 text-slate-300">
            Permanently delete your SkillSwap account.
          </p>

          <button
          onClick={handleDeleteAccount}
            className="mt-5 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600">
            Delete Account
          </button>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <Info className="text-green-400" />
            <h2 className="text-2xl font-semibold text-white">
              About
            </h2>
          </div>

          <p className="mt-4 text-slate-300">
            SkillSwap
          </p>

          <p className="text-slate-300">
            Version 1.0
          </p>

          <p className="mt-3 text-slate-400">
            Built with React, Firebase and Tailwind CSS.
          </p>

        </div>

      </div>
    </div>
  );
}

export default SettingsPage;