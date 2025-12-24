"use client";
import {useState,useRef} from "react";
import DynamicPost from "@/components/DynamicPost";

export default function Home() {
  const inputRef = useRef("");
  const searchPost = () =>{
    fetch("/api/posts?q=" + inputRef.current.value)
    .then((res) => res.json())

  }
  return (
    <>
      <main>
        <div className="my-5 p-5 text-center position-relative">
          <div
            className="blob bg-pink position-absolute"
            style={{ left: "220px", top: "3" }}
          ></div>
          <div
            className="blob bg-purple position-absolute"
            style={{ right: "220px", top: "3" }}
          ></div>
          <p className="display-5 welcome-title">Welcome to BlogSpace!!!</p>
          <p className="h2 text-muted tagline">Post, Share, Trend</p>
          <br />
          <br />
          <br />
          <br />
          <br />
          
          <br/>
          <h1 className="mt-4 mb-5 section-heading">Recent Blogs</h1>
          <DynamicPost />
        </div>
      </main>
      <div className="my-5 p-5"></div>
    </>
  );
}
