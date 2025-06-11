import React from "react";
import { useRef} from "react";


export interface Post {
  _id: string;
  title: string;
  excerpt?: string;
}

export default function PostCard({post} : {post: Post}) 
{
  const ref = useRef<HTMLDivElement>(null);

  function onDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("text/plain", post._id);
  }

  return (
    <article
      ref={ref}
      draggable
      onDragStart={onDragStart}
      className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 mb-3"
    >
      <h2 className="text-xl font-bold mb-1">{post.title}</h2>
      <p className="line-clamp-3">{post.excerpt}</p>
    </article>
  );
}
