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
    if (pw !== confirm) return setErr("Passwords do not match");

    try {
      await register(email, pw);
      nav("/verify");
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;
      setErr(status ? `Error ${status}: ${data?.error || data}` : error.message);
    }
  }

  return (
    <main className="card auth-box">
      <h1 className="auth-title">Create account</h1>
      <form onSubmit={handleSubmit} className="flex-col-gap">
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {err && <p className="auth-error">{err}</p>}
        <button className="btn btn-primary">Register</button>
      </form>
    </main>
  );
}
