import { useState } from "react";
import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: Location } };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(email, pw);
    if (ok) {
      const dest = loc.state?.from?.pathname ?? "/";
      nav(dest);
    } else setErr("Invalid credentials");
  }

  return (
    <main className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4 font-bold">Sign in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
        />
        {err && <p className="text-red-600">{err}</p>}
        <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500">
          Sign in
        </button>
      </form>
      <p className="mt-4 text-sm">
        New here?{" "}
        <Link to="/register" className="text-indigo-700 underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
