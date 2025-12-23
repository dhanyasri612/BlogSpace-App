"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const readStoredUser = () => {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("user");
  try {
    if (
      storedUser &&
      storedUser !== "undefined" &&
      storedUser !== "null" &&
      storedUser.trim() !== ""
    ) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(readStoredUser);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // Function to check and update user state
  const checkUser = useCallback(() => {
    setUser(readStoredUser());
  }, []);

  useEffect(() => {
    // Listen for storage changes (when user logs in/out in another tab or window)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        checkUser();
      }
    };

    // Listen for custom event (when user logs in/out in same window)
    const handleUserChange = () => {
      checkUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userStateChange", handleUserChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userStateChange", handleUserChange);
    };
  }, [checkUser]);

  // Also check user state on focus (when user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      checkUser();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [checkUser]);

  return (
    <nav className="c-navbar">
      <div className="c-navbar-container">
        {/* Logo */}
        <Link href="/" className="c-navbar-logo">
          BlogSpace
        </Link>

        {/* Hamburger Button */}
        <button
          className={`c-navbar-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        {/* Menu Links */}
        <ul className={`c-navbar-menu ${menuOpen ? "active" : ""} my-3`}>
          <li>
            <Link href="/" onClick={handleLinkClick}>
              Home
            </Link>
          </li>

          <li>
            <Link href="/about" onClick={handleLinkClick}>
              About
            </Link>
          </li>

          <li>
            <Link href="/contact" onClick={handleLinkClick}>
              Contact
            </Link>
          </li>

          {!user ? (
            // Not logged in → Show Login
            <li>
              <Link href="/login" onClick={handleLinkClick}>
                Login
              </Link>
            </li>
          ) : (
            // Logged in → Show Profile Icon
            <>
              <li>
                <Link
                  href="/create-post"
                  className="c-create-post-btn"
                  onClick={handleLinkClick}
                >
                  Create Post
                </Link>
              </li>
              <li>
                <Link href="/post" onClick={handleLinkClick}>
                  My Posts
                </Link>
              </li>
              <li>
                <Link href="/profile" onClick={handleLinkClick}>
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
