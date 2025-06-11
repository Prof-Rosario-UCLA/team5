import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentPane from "../components/CommentPane";
import type { Post } from "../components/PostCard";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post & { html: string }>();

  useEffect(() => {
    axios.get(`/api/posts/${id}`).then((r) => setPost(r.data));
  }, [id]);

  if (!post) return <p className="p-8">Loading…</p>;

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <CommentPane postId={post._id} />
    </article>
  );
}
