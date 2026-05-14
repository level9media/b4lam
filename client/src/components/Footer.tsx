/**
 * BLINDSIDE LOUNGE — Footer
 * Dark, minimal, neon accents
 */

export default function Footer() {
  return (
    <footer
      style={{
        background: "#000000",
        borderTop: "1px solid rgba(43,127,255,0.12)",
        padding: "3rem 0 1.5rem",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Brand column */}
          <div>
            <img
              src="/manus-storage/logo_11eca033.webp"
              alt="Blindside Lounge"
              style={{
                height: "60px",
                width: "auto",
                marginBottom: "1rem",
                filter: "drop-shadow(0 0 8px rgba(43,127,255,0.4))",
              }}
            />
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 300,
                fontSize: "1rem",
                letterSpacing: "0.3em",
                color: "#e8eaf0",
                marginBottom: "0.25rem",
              }}
            >
              BLINDSIDE
            </p>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 300,
                fontSize: "0.6rem",
                letterSpacing: "0.55em",
                color: "#8B3FBF",
                textShadow: "0 0 8px rgba(139,63,191,0.6)",
                marginBottom: "1rem",
              }}
            >
              LOUNGE
            </p>
            <p
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 300,
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                color: "rgba(184,196,208,0.5)",
                fontStyle: "italic",
              }}
            >
              Upscale. Inviting. Unforgettable.
            </p>
          </div>

          {/* Visit */}
          <div>
            <h4
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#2B7FFF",
                textShadow: "0 0 8px rgba(43,127,255,0.5)",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              Visit Us
            </h4>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.85rem", color: "rgba(184,196,208,0.7)", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              211 E. 6th Street<br />
              Austin, TX 78701
            </p>
            <a
              href="tel:5122361126"
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(184,196,208,0.7)",
                textDecoration: "none",
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              (512) 236-1126
            </a>
          </div>

          {/* Hours */}
          <div>
            <h4
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#2B7FFF",
                textShadow: "0 0 8px rgba(43,127,255,0.5)",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              Hours
            </h4>
            {[
              ["Mon – Wed", "Closed"],
              ["Thu – Fri", "9PM – 2AM"],
              ["Saturday", "9PM – 2AM"],
              ["Sunday", "Closed"],
            ].map(([day, hours]) => (
              <div key={day} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem", color: "rgba(184,196,208,0.55)" }}>{day}</span>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem", color: hours === "Closed" ? "rgba(184,196,208,0.3)" : "rgba(184,196,208,0.8)" }}>{hours}</span>
              </div>
            ))}
          </div>

          {/* Pages */}
          <div>
            <h4
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#2B7FFF",
                textShadow: "0 0 8px rgba(43,127,255,0.5)",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              Explore
            </h4>
            {[
              { label: "About Us", href: "/about" },
              { label: "Events & Nightlife", href: "/events" },
              { label: "The Experience", href: "/experience" },
              { label: "Cocktail Menu", href: "/menu" },
              { label: "Artist Discovery", href: "/artists" },
              { label: "Video Recording of Set — $50", href: "/video-recording" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  display: "block",
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.82rem",
                  color: "rgba(184,196,208,0.6)",
                  textDecoration: "none",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.05em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#2B7FFF"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(184,196,208,0.6)"; }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Social */}
          <div>
            <h4
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#2B7FFF",
                textShadow: "0 0 8px rgba(43,127,255,0.5)",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              Follow
            </h4>
            <a
              href="https://www.instagram.com/blindsidelounge"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.82rem",
                color: "rgba(184,196,208,0.7)",
                textDecoration: "none",
                marginBottom: "0.75rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#2B7FFF"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(184,196,208,0.7)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @blindsidelounge
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1.25rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.7rem",
              color: "rgba(184,196,208,0.3)",
              letterSpacing: "0.05em",
            }}
          >
            © {new Date().getFullYear()} Blindside Lounge. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.7rem",
              color: "rgba(184,196,208,0.25)",
              letterSpacing: "0.05em",
            }}
          >
            Site built & managed by{" "}
            <a
              href="https://levelninemedia.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(43,127,255,0.5)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#2B7FFF"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(43,127,255,0.5)"; }}
            >
              Level Nine Media
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
