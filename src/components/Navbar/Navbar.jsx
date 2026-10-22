// create navbar and then export navbar to every other page it requires
// React provides many built-in functions called Hooks, usestate is one of them and It allows your component to remember values
// menu and x are icons
// initially ismenuopen contains false and setismenuopen changes it to true when clicked [current val,function to change it]
// The key helps React identify each item efficiently
// button aschild=> The Button component doesn't render a <button> anymore. Instead, it styles the NavLink to look like a button.

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import NotificationBell from "@/components/Notifications/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

function Navbar() {
  const { currentUser, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Could not log out. Please try again.");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Skills", path: "/skills" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#081E4C]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <NavLink
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="text-3xl font-extrabold tracking-tight text-blue-400">
          SkillSwap
        </NavLink>

        <ul className="hidden items-center gap-8 text-lg font-medium md:flex">

          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 transition duration-300"
                    : "text-white transition duration-300 hover:text-blue-400"
                }>
                {link.name}
              </NavLink>
            </li>
          ))}

          {currentUser ? (
            <>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-400 transition duration-300"
                      : "text-white transition duration-300 hover:text-blue-400"
                  }>
                  Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/my-workspaces"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-400 transition duration-300"
                      : "text-white transition duration-300 hover:text-blue-400"
                  }>
                  My Workspaces
                </NavLink>
              </li>

              <li>
                <NotificationBell />
              </li>
              <li>
                <NavLink
                to="/settings"
                className={({isActive})=>
                isActive
                ?"text-blue-400 transition duration-300"
                :"text-white transition duration-300 hover:text-blue-400"
                }>
                Settings
              </NavLink>
              </li>

              <Button
                onClick={handleLogout}
                className="h-12 rounded-xl bg-red-500 px-7 text-base font-semibold hover:bg-red-600">
                Logout
              </Button>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className="text-white transition duration-300 hover:text-blue-400">
                  Login
                </NavLink>
              </li>

              <Button
                asChild
                className="h-12 rounded-xl bg-blue-500 px-7 text-base font-semibold hover:bg-blue-600">
                <NavLink to="/signup">
                  Sign Up
                </NavLink>
              </Button>
            </>
          )}

        </ul>

        <button
          type="button"
          className="text-white md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {isMenuOpen && (
        <div className="space-y-5 border-t border-white/10 bg-[#081E4C] px-6 py-6 md:hidden">

          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/"}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block text-blue-400 transition duration-300"
                  : "block text-white transition duration-300 hover:text-blue-400"
              }>
              {link.name}
            </NavLink>
          ))}

          {currentUser ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block text-blue-400"
                    : "block text-white hover:text-blue-400"
                }>
                Dashboard
              </NavLink>

              <NavLink
                to="/my-workspaces"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block text-blue-400"
                    : "block text-white hover:text-blue-400"
                }>
                My Workspaces
              </NavLink>

              <NotificationBell />
              <NavLink
              to="/settings"
              onClick={()=>setIsMenuOpen(false)}
              className={({isActive})=>
              isActive
              ?"block text-blue-400"
              :"block text-white hover:text-blue-400"}>
                Settings
              </NavLink>

              <Button
                onClick={handleLogout}
                className="h-12 w-full rounded-xl bg-red-500 text-base font-semibold hover:bg-red-600">
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-white hover:text-blue-400">
                Login
              </NavLink>

              <Button
                asChild
                className="h-12 w-full rounded-xl bg-blue-500 text-base font-semibold hover:bg-blue-600">
                <NavLink
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </NavLink>
              </Button>
            </>
          )}

        </div>
      )}
    </nav>
  );
}

export default Navbar;