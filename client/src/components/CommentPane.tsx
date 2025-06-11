import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

interface Comment {
  _id: string;
  author: string;
  body: string;
  createdAt: string;
}

export default function CommentPane({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const sock = useRef<Socket | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 1️⃣ Fetch existing comments
  useEffect(() => {
    axios
      .get<Comment[]>(`/api/posts/${postId}/comments`, { withCredentials: true })
      .then((r) => setComments(r.data))
      .catch(console.error);
  }, [postId]);

  // 2️⃣ Socket.io setup
  useEffect(() => {
    sock.current = io("http://localhost:8080", {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    sock.current.emit("comment:join", { postId });
    sock.current.on("comment:new", (c: Comment) =>
      setComments((arr) => [...arr, c])
    );

    return () => {
      sock.current?.disconnect();
    };
  }, [postId]);

  // 3️⃣ Auto‐scroll on new comments
  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [comments.length]);

  async function send() {
    if (!body.trim() || !user) return;
    try {
      await axios.post(
        `/api/posts/${postId}/comments`,
        { body },
        { withCredentials: true }
      );
      setBody("");
    } catch (err) {
      console.error("Comment POST failed", err);
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div
        ref={listRef}
        className="max-h-60 overflow-y-auto space-y-3 border p-3 rounded-md bg-white dark:bg-slate-800"
      >
        {comments.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No comments yet.
          </p>
        )}
        {comments.map((c) => (
          <div key={c._id} className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{c.author}</span>{" "}
              <span className="text-xs">
                · {new Date(c.createdAt).toLocaleTimeString()}
              </span>
            </p>
            <p className="pl-2 text-gray-800 dark:text-gray-200">{c.body}</p>
          </div>
        ))}
      </div>

      {user ? (
        <div className="mt-4 flex gap-2">
          <textarea
            className="flex-1 border rounded-md px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
            placeholder="Write a comment..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            onClick={send}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
          >
            Send
          </button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          Sign in to join the conversation.
        </p>
      )}
    </section>
  );
}
