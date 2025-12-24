"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // success, error, info
  const [isValidating, setIsValidating] = useState(false);
  const [emailValidation, setEmailValidation] = useState({ isValid: null, message: "" });
  const userHandle = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    
    // Reset email validation when email field changes
    if (e.target.name === 'email') {
      setEmailValidation({ isValid: null, message: "" });
    }
  };

  // Debounced email validation
  const validateEmailField = async (email) => {
    if (!email) {
      setEmailValidation({ isValid: null, message: "" });
      return;
    }

    // Basic format check first
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidFormat) {
      setEmailValidation({ isValid: false, message: "Invalid email format" });
      return;
    }

    // Quick disposable email check
    const disposableDomains = ['10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org', 'yopmail.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      setEmailValidation({ isValid: false, message: "Disposable emails not allowed" });
      return;
    }

    setEmailValidation({ isValid: null, message: "Checking..." });
    
    try {
      // Add timeout to prevent long waits
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const res = await fetch('/api/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await res.json();
      
      if (data.isValid) {
        setEmailValidation({ isValid: true, message: "" }); // Remove "Valid email" text
      } else {
        setEmailValidation({ isValid: false, message: data.errors?.join(', ') || "Invalid email" });
      }
    } catch (error) {
      // More graceful error handling - don't show error for network issues
      console.warn('Email validation API unavailable:', error.message);
      setEmailValidation({ isValid: null, message: "" }); // Clear validation state instead of showing error
    }
  };

  // Debounce email validation
  useEffect(() => {
    if (user.email) {
      const timeoutId = setTimeout(() => {
        validateEmailField(user.email);
      }, 1000); // Wait 1 second after user stops typing
      
      return () => clearTimeout(timeoutId);
    }
  }, [user.email]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (!user.username || !user.email || !user.password) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Basic email format check
    const isValidEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
    if (!isValidEmail(user.email)) {
      setMessage("Please enter a valid email address format");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Check for disposable email domains (basic client-side check)
    const disposableDomains = ['10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org', 'yopmail.com'];
    const emailDomain = user.email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      setMessage("Disposable email addresses are not allowed. Please use a permanent email address.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setMessage("Validating email address...");
    setMessageType("info");
    setIsValidating(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      
      // Handle validation errors with detailed messages
      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setMessage(data.errors.join('. '));
        } else {
          setMessage(data.message || "Registration failed");
        }
        setMessageType("error");
        setTimeout(() => setMessage(""), 5000);
        return;
      }

      // Success case
      let displayMessage = data.message || "Registration successful.";
      setMessage(displayMessage);
      setMessageType("success");
      setUser({});
      
      // Clear message after 10 seconds (longer for verification link)
      setTimeout(() => {
        setMessage("");
      }, 10000);
    } catch (err) {
      setMessage("Registration failed. Please check your internet connection and try again.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsValidating(false);
    }
  };
  
  return (
    <div>
      <div>
        <br />
        <br />
        <br />
        <br />
        <div className="container " style={{ maxWidth: "1000px" }}>
          <form
            className="border border-2 rounded border-info p-3 m-5"
            style={{ background: "rgba(220, 248, 246, 0.49)" }}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center mb-4">Register Page</h2>
            
            <div className="mb-3">
              <label className="form-label">UserName</label>
              <input
                type="text"
                className="form-control"
                style={{ background: "rgba(200, 244, 246, 1)" }}
                placeholder="Enter your name"
                name="username"
                value={user.username ?? ""}
                onChange={userHandle}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${
                  emailValidation.isValid === true 
                    ? 'border-success' 
                    : emailValidation.isValid === false 
                    ? 'border-danger' 
                    : ''
                }`}
                style={{ background: "rgba(200, 244, 246, 1)" }}
                placeholder="Enter your email"
                name="email"
                value={user.email ?? ""}
                onChange={userHandle}
              />
              {emailValidation.message && (
                <div 
                  className={`mt-1 ${
                    emailValidation.isValid === true 
                      ? 'text-success' 
                      : emailValidation.isValid === false 
                      ? 'text-danger' 
                      : 'text-muted'
                  }`}
                  style={{ fontSize: '0.875rem' }}
                >
                  {emailValidation.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                style={{ background: "rgba(200, 244, 246, 1)" }}
                placeholder="Enter your password"
                name="password"
                value={user.password ?? ""}
                onChange={userHandle}
              />
            </div>
            <button 
              className="btn btn-info mt-4 w-100 text-white" 
              disabled={isValidating}
            >
              {isValidating ? "Validating..." : "Register"}
            </button>
          </form>
          <p className="text-center text-secondary text-capitalize">
            {" "}
            <Link href="/login">Login</Link>
          </p>
        </div>
        <br />
        {message && (
          <p 
            className={`text-center font-weight-bold ${
              messageType === "success" 
                ? "text-success" 
                : messageType === "error" 
                ? "text-danger" 
                : "text-info"
            }`}
          >
            {message}
          </p>
        )}
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
