"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [emailError, setEmailError] = useState("");

  function isValidPassword(password: string): boolean {
    const lenghOK = password.length >= 4 && password.length <= 20;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    return lenghOK && hasLower && hasNumber && hasUpper && hasSpecial;
  }
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");
    setConfirmError("");
    setEmailError("");

    if (username.length < 3) {
      setUsernameError("username must be more then 3 caracters");
      return;
    }
    if (!isValidPassword(password)) {
      setPasswordError(
        "Password: 8–20 chars, include uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (password !== confirmpass) {
      setConfirmError("passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          email: email.toLocaleLowerCase().trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error();
      }
      console.log("sign up successfully:", data);
      router.push("/login");
    } catch (error) {
      console.error("sign up error:", error);
    }
  }
  return (
    <div className=" min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <h1 className="text-center p-4 font-semibold text-2xl mt-4 tracking-tight">
          Sign up
        </h1>
        <form onSubmit={handleSignIn} className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          {usernameError && (
            <p className="text-sm text-red-400 mt-1">{usernameError}</p>
          )}
          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          {passwordError && (
            <p className="text-sm text-red-400 mt-1">{passwordError}</p>
          )}
          <input
            type="text"
            placeholder="confirm password"
            value={confirmpass}
            onChange={(e) => setConfirmpass(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          {confirmError && (
            <p className="text-sm text-red-400 mt-1">{confirmError}</p>
          )}
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            type="submit"
            className=" inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
