import React from "react";
import { useRef} from "react";


export interface Post {
  _id: string;
  title: string;
  excerpt?: string;
  email: string;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="card post-card">
      <h2>{post.title}</h2>
      <p style={{ color: "#555" }}>
      </p>
    </div>
  );
}
