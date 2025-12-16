"use client";

import DynamicPost from "@/components/DynamicPost";

export default function PostsPage() {
  return (
    <main className="container my-5">
      <h1 className="mb-4 text-center">My Posts</h1>
      <DynamicPost showOnlyCurrentUserPosts />
    </main>
  );
}


