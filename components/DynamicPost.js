"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// showOnlyCurrentUserPosts:
// - false (default): show all posts (home page)
// - true: show only logged-in user's posts (My Posts page)
const DynamicPost = ({ showOnlyCurrentUserPosts = false }) => {
  const [post, setPost] = useState([]);
  const [search, setSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  const inputRef = useRef(null);

  /* =========================
     LOAD USER FROM STORAGE
  ========================== */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user:", error);
      localStorage.removeItem("user");
    }
  }, []);

  /* =========================
     FETCH POSTS
  ========================== */
  const fetchPosts = async ({ query = "" } = {}) => {
    try {
      const params = new URLSearchParams();

      if (query) {
        params.set("q", query);
      }
      if (showOnlyCurrentUserPosts && user?._id) {
        params.set("userId", user._id);
      }

      const qs = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/posts${qs}`);
      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();
      setPost(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setPost([]);
    }
  };

  // Initial load and when user changes (for My Posts view)
  useEffect(() => {
    if (showOnlyCurrentUserPosts) {
      if (user) {
        fetchPosts({ query: "" });
      }
    } else {
      fetchPosts({ query: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnlyCurrentUserPosts, user]);

  /* =========================
     SEARCH POSTS
  ========================== */
  const searchPost = async (e) => {
    if (e.type === "keydown" && e.key !== "Enter") return;

    const query = inputRef.current?.value?.trim() || "";
    setSearch(true);
    setSearchQuery(query);

    try {
      await fetchPosts({ query });
    } finally {
      setSearch(false);
    }
  };

  return (
    <div>
      {/* SEARCH BAR */}
      <div className="d-flex justify-content-end mb-4">
        <input
          ref={inputRef}
          onKeyDown={searchPost}
          type="text"
          className="form-control me-2 search-input-enhanced"
          placeholder="Search Blogs..."
          style={{ width: "350px" }}
        />
        <button
          className="btn btn-success search-btn-enhanced"
          onClick={searchPost}
          disabled={search}
        >
          {search ? "Searching..." : "Search"}
        </button>
      </div>

      {/* POSTS */}
      <div className="row">
        {post.map((item) => (
          <div key={item._id} className="col-12 col-md-6 col-lg-4 mb-4">
            <Link
              href={`/post/${item._id}`}
              className="text-reset text-decoration-none"
            >
              <div className="card h-100 shadow-sm position-relative">
                {item.image && item.image.trim() !== "" && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img-top"
                  />
                )}

                <div className="card-body">
                  <h6 className="card-title">{item.title}</h6>

                  {(item.author || item.user) && (
                    <small className="text-muted d-block mb-2">
                      <strong>By:</strong>{" "}
                      {(item.author &&
                        (item.author.username || item.author.email)) ||
                        (item.user && (item.user.username || item.user.email))}
                    </small>
                  )}

                  <p className="card-text text-justify">
                    {item.short_description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* NO RESULTS */}
      {post.length === 0 && !search && searchQuery && (
        <div className="text-center mt-5">
          <h4>
            No Blogs Found for <b>{searchQuery}</b>
          </h4>
        </div>
      )}
    </div>
  );
};

export default DynamicPost;
