import { useEffect, useRef, useState } from "react";
import React from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

interface Comment {
  author: string;
  body: string;
  ts: number;
}

export default function CommentPane({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const sock = useRef<Socket | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sock.current = io("/", { withCredentials: true });
    sock.current.emit("comment:join", { postId });

    sock.current.on("comment:new", (c: Comment) =>
      setComments((arr) => [...arr, c])
    );

    return () => {
      sock.current?.disconnect();
    };
  }, [postId]);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [comments.length]);

  async function send() {
    if (!body.trim()) return;
    const comment: Comment = {
      author: user?.email ?? "anon",
      body,
      ts: Date.now()
    };
    sock.current?.emit("comment:send", { postId, comment });
    setBody("");
  }

  return (
    <section className="border-t pt-4">
      <h2 className="font-bold mb-2">Comments</h2>
      <div
        ref={listRef}
        className="h-56 overflow-y-auto space-y-2 border p-2 rounded"
      >
        {comments.map((c, i) => (
          <p key={i}>
            <span className="font-bold">{c.author}</span>: {c.body}
          </p>
        ))}
      </div>
      {user ? (
        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 border p-2 rounded"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Say something…"
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            className="bg-indigo-600 text-white px-3 rounded hover:bg-indigo-500"
          >
            Send
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-2">
          Sign in to join the conversation.
        </p>
      )}
    </section>
  );
}
