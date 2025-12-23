"use client";
import { useState, useRef } from "react";
import DynamicPost from "@/components/DynamicPost";

export default function Home() {
  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                Welcome to <span className="hero-brand">BlogSpace</span>
              </h1>
              <p className="hero-subtitle">
                Share your thoughts, discover amazing stories, and connect with writers from around the world
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Stories</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Writers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Readers</span>
                </div>
              </div>
            </div>
            <div className="hero-decoration">
              <div className="floating-card card-1">
                <div className="card-icon">✍️</div>
                <div className="card-text">Write</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">📖</div>
                <div className="card-text">Read</div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">🚀</div>
                <div className="card-text">Share</div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Blogs Section */}
        <section className="blogs-section">
          <div className="blogs-container">
            <div className="section-header">
              <h2 className="section-title">Latest Stories</h2>
              <p className="section-subtitle">Discover fresh perspectives and engaging content from our community</p>
            </div>
            <DynamicPost />
          </div>
        </section>
      </main>
    </>
  );
}