import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const { register } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    try{
        const ok = await register(email, pw);
        nav("/verify");
    }
    catch(error:any){
        console.error("Failed to register");
        const status= error.response?.status;
        const data = error.response?.data;
        setErr(status ? `Error ${status} : ${data?.error || data || error.message}`: error.message);

    }
  }

  return (
    <main className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4 font-bold">Create account</h1>
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
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {err && <p className="text-red-600">{err}</p>}
        <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500">
          Register
        </button>
      </form>
    </main>
  );
}
