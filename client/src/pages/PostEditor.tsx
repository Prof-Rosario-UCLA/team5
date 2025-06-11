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
        const { data } = await axios.post<{ _id: string }>("/api/posts", {
        title,
        markdown
        }, {withCredentials: true});
        nav(`/${data._id}`);
    } catch(error: any) {
        const msg = error.response?.data?.error ?? error.message ?? "Unknown Error";
        console.error("Post /api/posts failed", msg);
        setErr(msg);
    }
  }

  return (
    <main className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 p-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          className="border p-2 rounded h-64 font-mono"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Write in Markdown…"
          required
        />
        {err && <p className="text-red-600">{err}</p>}
        <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500">
          Publish
        </button>
      </form>

      <article
        className="prose dark:prose-invert overflow-auto border rounded p-4"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
      ></article>
    </main>
  );
}
