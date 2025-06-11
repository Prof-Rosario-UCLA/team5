import { useEffect, useState } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyPage() {
  const { token } = useParams<{ token: string }>();
  const nav = useNavigate();
  const [status, setStatus] = useState<"pending"|"success"|"error">("pending");

  useEffect(() => {
    axios
      .get(`/api/auth/verify/${token}`, { withCredentials: true })
      .then(() => {
        setStatus("success");
        setTimeout(() => nav("/login"), 2000);
      })
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "pending") return <p>Verifying…</p>;
  if (status === "success")
    return <p>Email verified! Redirecting to login…</p>;
  return <p>Invalid or expired verification link.</p>;
}
