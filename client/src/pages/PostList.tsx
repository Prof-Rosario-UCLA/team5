import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import PostCard, { Post } from "../components/PostCard";

const PAGE_SIZE = 10;

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    const { data } = await axios.get<Post[]>(
      `/api/posts?page=${page}&limit=${PAGE_SIZE}`
    );
    setPosts((p) => [...p, ...data]);
    setHasMore(data.length === PAGE_SIZE);
  }, [page]);

  useEffect(() => {
    load();
  }, [page]);

  return (
    <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px] max-w-5xl mx-auto">
      <div>
        {posts.map((p) => (
          <Link key={p._id} to={`/${p._id}`}>
            <PostCard post={p} />
          </Link>
        ))}
        {hasMore && (
          <div ref={loader} className="text-center py-4 text-sm text-gray-500">
            Loading…
          </div>
        )}
      </div>

      <aside className="hidden md:block">
        <TrendingSidebar />
      </aside>
    </section>
  );
}

function TrendingSidebar() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    axios
      .get("/api/posts/trending/ids").then((r) => {
        if (Array.isArray(r.data)) setIds(r.data);
        else if (Array.isArray(r.data.ids)) setIds(r.data.ids);
      });
  }, []);

  return (
    <div className="sticky top-4 space-y-2">
      <h2 className="font-bold mb-2">Trending</h2>
      {ids.map((id) => (
        <Link
          key={id}
          to={`/${id}`}
          className="block text-indigo-700 hover:underline"
        >
          {id.slice(0, 6)}…
        </Link>
      ))}
    </div>
  );
}
