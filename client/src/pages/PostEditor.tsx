import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import React from "react";
import { renderMarkdown } from "../utils/mdRender";

export default function PostEditor() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [err, setErr] = useState("");

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await axios.post<{ _id: string }>(
        "/api/posts",
        { title, markdown },
        { withCredentials: true }
      );
      nav(`/${data._id}`);
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message;
      setErr(msg);
    }
  }

  return (
    <main className="container" style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
      {/* editor */}
      <form onSubmit={handleSubmit} className="flex-col-gap">
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          className="textarea"
          style={{ height: "260px", fontFamily: "monospace" }}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Write in Markdown…"
          required
        />
        {err && <p className="auth-error">{err}</p>}
        <button className="btn btn-primary">Publish</button>
      </form>

      {/* live preview */}
      <article
        className="card"
        style={{ padding: "1rem", overflowY: "auto" }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
      />
    </main>
  );
}
