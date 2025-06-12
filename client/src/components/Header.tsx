import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
          BruinBlog
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/new">New&nbsp;Post</Link>
          <Link to="#">About</Link>
        </nav>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>{user.email}</span>
            <button
              className="btn btn-primary"
              onClick={() => logout().then(() => nav("/login"))}
            >
              Log&nbsp;out
            </button>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/login">Sign&nbsp;in</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}
