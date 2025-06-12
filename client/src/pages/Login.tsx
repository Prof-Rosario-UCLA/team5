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
    ok ? nav(loc.state?.from?.pathname ?? "/") : setErr("Invalid credentials");
  }

  return (
    <main className="card auth-box">
      <h1 className="auth-title">Sign&nbsp;in</h1>
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
        {err && <p className="auth-error">{err}</p>}
        <button className="btn btn-primary">Sign&nbsp;in</button>
      </form>

      <p className="text-small" style={{ marginTop: "1rem" }}>
        New here?&nbsp;
        <Link to="/register">Create an account</Link>
      </p>
    </main>
  );
}
