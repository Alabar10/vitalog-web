"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
export type User = { id: number; username: string; email: string } | null;
type Variant = "landing" | "solid";
type NavbarProps = {
  variant?: "landing" | "solid";
  className?: string;
};
const Navbar = ({ variant = "landing", className }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const variants: Record<Variant, string> = {
    landing:
      "bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-300 text-white",
    solid: "bg-gradient-to-br from-blue-500 via-purple-500  animate-gradient-x",
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/");
    } catch (error) {}
  };
  return (
    <div>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 ${
          variants[variant]
        } ${className ?? ""}`}
      >
        {" "}
        <div className="flex items-center gap-2 font-bold text-white ml-8">
          <svg
            width="30"
            height="20"
            viewBox="0 0 26 18"
            aria-hidden="true"
            className="drop-shadow-sm"
          >
            <path
              d="M1 9h5l2.2-6 4.2 12 2.2-6H25"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            />
          </svg>
          <span className="text-xl md:text-3xl tracking-tight">VitaLog</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white focus:outline-none"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
        <div className="hidden md:flex gap-6">
          <Link
            href="/landingpage"
            className="text-white/90 text-xl hover:text-black transition-colors duration-200 "
          >
            Home
          </Link>
          {!user && (
            <Link
              href="/features"
              className="text-white/90 text-xl hover:text-black transition-colors duration-200 "
            >
              Features
            </Link>
          )}
          {user && (
            <Link
              href="/dashboard"
              className="text-white/90 text-xl hover:text-black transition-colors duration-200 "
            >
              Dashboard
            </Link>
            
          )}
          {user && (
            <Link
              href="/insights"
              className="text-white/90 text-xl hover:text-black transition-colors duration-200 "
            >
              Insights
            </Link>
            
          )}
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="rounded-full bg-white/90 text-indigo-700 px-4 py-1.5 font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white/90 text-xl hover:text-black transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-white text-indigo-700 px-4 py-1.5 font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        {/* mobile */}
        {open && (
          <div className="absolute top-full right-0 w-56 h-screen md:hidden border-t border-white/20 bg-white/10 backdrop-blur-xl">
            <div className="flex flex-col items-center gap-10 py-6">
              <Link
                href="/landingpage"
                onClick={() => setOpen(false)}
                className="text-lg text-white hover:text-indigo-300"
              >
                Home
              </Link>
              <Link
                href="/features"
                onClick={() => setOpen(false)}
                className="text-lg text-white hover:text-indigo-300"
              >
                Features
              </Link>
              <Link
                href="/homepage"
                onClick={() => setOpen(false)}
                className="text-lg text-white hover:text-indigo-300"
              >
                Dashboard
              </Link>

              {user ? (
                <>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="rounded-full bg-white/90 text-indigo-700 px-4 py-1.5 font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-lg text-white hover:text-indigo-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="text-lg text-white hover:text-indigo-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
