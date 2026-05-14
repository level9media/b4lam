/**
 * BLINDSIDE LOUNGE — Navbar
 * Fixed top nav, transparent → dark on scroll
 * Neon accent on active/hover links
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Experience", href: "#experience" },
  { label: "Cocktails", href: "#cocktails" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reserve", href: "#reserve" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease",
        background: scrolled
          ? "rgba(0,0,0,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(43,127,255,0.15)"
          : "1px solid transparent",
      }}
    >
      <div className="container flex items-center justify-between" style={{ height: "72px" }}>
        {/* Logo lockup */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <img
            src="/manus-storage/logo_11eca033.webp"
            alt="Blindside Lounge"
            style={{
              height: "42px",
              width: "auto",
              filter: "drop-shadow(0 0 6px rgba(43,127,255,0.5))",
            }}
          />
          <div className="hidden md:flex flex-col">
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 300,
                fontSize: "0.95rem",
                letterSpacing: "0.3em",
                color: "#e8eaf0",
                lineHeight: 1,
              }}
            >
              BLINDSIDE
            </span>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 300,
                fontSize: "0.55rem",
                letterSpacing: "0.55em",
                color: "#8B3FBF",
                textShadow: "0 0 8px rgba(139,63,191,0.7)",
              }}
            >
              LOUNGE
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                color: "rgba(184,196,208,0.75)",
                textTransform: "uppercase",
                transition: "color 0.25s ease, text-shadow 0.25s ease",
                padding: "4px 0",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "#2B7FFF";
                (e.target as HTMLElement).style.textShadow =
                  "0 0 8px rgba(43,127,255,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "rgba(184,196,208,0.75)";
                (e.target as HTMLElement).style.textShadow = "none";
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <a
          href="tel:5122361126"
          className="hidden md:flex items-center gap-2"
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 600,
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            color: "#000",
            background: "linear-gradient(135deg, #2B7FFF, #8B3FBF)",
            padding: "9px 20px",
            textDecoration: "none",
            textTransform: "uppercase",
            transition: "box-shadow 0.25s ease, transform 0.15s ease",
            boxShadow: "0 0 15px rgba(43,127,255,0.4)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 25px rgba(43,127,255,0.7), 0 0 50px rgba(139,63,191,0.4)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 15px rgba(43,127,255,0.4)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          Book Now
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none" }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                background: "#2B7FFF",
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform:
                  menuOpen
                    ? i === 0
                      ? "rotate(45deg) translate(4px, 4px)"
                      : i === 2
                      ? "rotate(-45deg) translate(4px, -4px)"
                      : "scaleX(0)"
                    : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            background: "rgba(0,0,0,0.97)",
            borderTop: "1px solid rgba(43,127,255,0.15)",
            padding: "1.5rem",
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <motion.button
              key={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => handleNav(link.href)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                fontFamily: "'Cinzel', serif",
                fontWeight: 400,
                fontSize: "1rem",
                letterSpacing: "0.2em",
                color: "rgba(184,196,208,0.85)",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {link.label}
            </motion.button>
          ))}
          <a
            href="tel:5122361126"
            style={{
              display: "block",
              marginTop: "1rem",
              textAlign: "center",
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              color: "#000",
              background: "linear-gradient(135deg, #2B7FFF, #8B3FBF)",
              padding: "12px",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Book Now
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
