import React from "react";

const AboutPage = () => {
  return (
    <main className="container my-5">
      {/* Hero Section with background image */}
      <section
        className="mb-5 rounded-4 overflow-hidden"
        style={{
          position: "relative",
          minHeight: "260px",
          backgroundImage: "url('/images/image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.35)",
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(120deg, rgba(15,23,42,0.80), rgba(30,64,175,0.75))",
          }}
        />

        {/* Hero content */}
        <div className="position-relative h-100">
          <div className="row align-items-center h-100 px-4 px-md-5 py-5">
            <div className="col-12 col-lg-7 text-white">
              <span
                className="badge mb-3"
                style={{
                  backgroundColor: "rgba(191, 219, 254, 0.16)",
                  color: "#E5E7EB",
                  borderRadius: "999px",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                About BlogSpace
              </span>
              <h1 className="display-5 fw-bold mb-3">Your space to write and grow.</h1>
              <p className="lead mb-2" style={{ color: "rgba(249,250,251,0.9)" }}>
                BlogSpace is a focused blogging experience where your words sit at the
                centre, supported by a simple and modern interface.
              </p>
              <p className="mb-0" style={{ color: "rgba(209,213,219,0.95)" }}>
                Draft ideas, share stories, and keep your posts organised – all from one
                clean dashboard designed for everyday creators.
              </p>
            </div>
          </div>
      </div>
      </section>

      {/* Feature Grid */}
      <section className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-2">Simple writing experience</h5>
              <p className="card-text text-muted mb-0">
                Focus on your words, not the tooling. BlogSpace keeps the interface
                minimal so that creating and updating posts feels effortless.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-2">All your posts in one place</h5>
              <p className="card-text text-muted mb-0">
                See everything you&apos;ve written at a glance. Use the dedicated
                &quot;My Posts&quot; page to review, edit, or clean up your content
                whenever you need.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-2">Built for everyday use</h5>
              <p className="card-text text-muted mb-0">
                Whether you&apos;re capturing ideas occasionally or posting regularly,
                BlogSpace stays fast, clear, and easy to return to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Note */}
      <section className="mt-5 text-center">
        <p className="text-muted mb-1">Ready to share your perspective?</p>
        <h4 className="fw-semibold mb-0">
          Start posting today and let BlogSpace handle the rest.
        </h4>
      </section>
    </main>
  );
};

export default AboutPage;
