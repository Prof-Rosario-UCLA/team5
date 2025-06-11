import { useAuth } from "../hooks/useAuth";
import React from "react";
import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({
  children
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <p className="p-8">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
