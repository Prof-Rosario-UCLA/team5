import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Post } from "../components/PostCard";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post & { html: string }>();

  useEffect(() => {
    axios.get(`/api/posts/${id}`).then((r) => setPost(r.data));
  }, [id]);

  if (!post) return <p style={{ padding: "2rem" }}>Loading…</p>;

  return (
    <div>
    <article className="post-detail card" style={{ padding: "2rem" }}>
      <h1>{post.title}</h1>
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

    </article>
    <div style={{textAlign: "center"}}>
      by {post.email}
    </div>
    </div>

  );
}
