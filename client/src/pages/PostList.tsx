import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import PostCard, { Post } from "../components/PostCard";

const PAGE_SIZE = 10;

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page] = useState(1);
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
    <section className="container post-list" style={{ marginTop: "2rem" }}>
      {/* feed column */}
      <div className="flex-col-gap">
        {posts.map((p) => (
          <Link key={p._id} to={`/${p._id}`}>
            <PostCard post={p} />
          </Link>
        ))}

        {hasMore && (
          <div
            ref={loader}
            className="text-small"
            style={{ textAlign: "center", padding: "1rem" }}
          >
            Loading…
          </div>
        )}
      </div>

      {/* sidebar */}
      <aside className="card" style={{ padding: "1rem" }}>
        <TrendingSidebar />
      </aside>
    </section>
  );
}

function TrendingSidebar() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    axios.get("/api/posts/trending/ids").then((r) => {
      const d = r.data;
      setIds(Array.isArray(d) ? d : d.ids || []);
    });
  }, []);

  return (
    <>
      <h2 className="comments-title">Trending</h2>
      {ids.map((id) => (
        <Link key={id} to={`/${id}`} style={{ display: "block", marginTop: ".5rem" }}>
          {id.slice(0, 6)}…
        </Link>
      ))}
    </>
  );
}
