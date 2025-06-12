import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

interface Comment {
  _id: string;
  body: string;
  createdAt: string;
  email: string;
}

export default function CommentPane({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const sock = useRef<Socket | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get<Comment[]>(`/api/posts/${postId}/comments`, { withCredentials: true })
      .then((r) => setComments(r.data))
      .catch(console.error);
  }, [postId]);


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
    <section className="comments">
      <h2 className="comments-title">Comments</h2>

      <div ref={listRef} className="comment-box">
        {comments.map((c, i) => (
          <p key={i}>
            <strong>{c.email}</strong>: {c.body}
          </p>
        ))}
      </div>

      {user ? (
        <div className="comment-form">
          <input
            className="input"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Say something…"
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="btn btn-primary" onClick={send}>
            Send
          </button>
        </div>
      ) : (
        <p className="text-small" style={{ marginTop: ".5rem" }}>
          Sign in to join the conversation.
        </p>
      )}
    </section>
  );
}
