"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
type LoginParams = {
  email: string;
  password: string;
};

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState("");

  async function handleLogIn({ email, password }: LoginParams) {
    try {
      setErrors("");
      const response = await fetch("http://localhost:4000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          "Invalid username or password.";
        setErrors(msg);
        return;
      }
      console.log("Logged in successfully:", data);
      router.push("/homepage");
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <div className=" min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <h1 className="text-center p-4 font-semibold text-2xl mt-4 tracking-tight">
          Log In
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogIn({ email, password });
          }}
          className="mt-8 space-y-5"
        >
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <div className=" relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors && (
            <p className="text-red-400 text-center text-sm">{errors}</p>
          )}
          <button
            type="submit"
            className=" inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            log in
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="cursor-pointer font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            click here
          </span>{" "}
          to sign up.
        </p>{" "}
      </div>
    </div>
  );
};

export default page;
