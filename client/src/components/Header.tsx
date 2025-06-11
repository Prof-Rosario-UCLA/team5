import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 py-2 shadow-md bg-indigo-700 text-white">
      <Link to="/" className="font-bold text-xl">
        BruinBlog
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <span>{user.email}</span>
          <button
            className="px-3 py-1 bg-indigo-500 rounded hover:bg-indigo-400"
            onClick={() => {
              logout().then(() => nav("/login"));
            }}
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login" className="hover:underline">
            Sign in
          </Link>
          <span>|</span>
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
