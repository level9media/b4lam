/**
 * VIDEO RECORDING OF SET — Order / Contact Page
 * $50 — Name, Artist/Band Name, Date of Performance, Email
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VideoRecording() {
  const [form, setForm] = useState({
    name: "",
    artistName: "",
    performanceDate: "",
    email: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Video Recording of Your Set | Blindside Lounge";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const subject = encodeURIComponent(`Video Recording Order — ${form.artistName} — ${form.performanceDate}`);
    const body = encodeURIComponent(
      `VIDEO RECORDING ORDER — $50\n\n` +
      `Name: ${form.name}\n` +
      `Artist / Band Name: ${form.artistName}\n` +
      `Date of Performance: ${form.performanceDate}\n` +
      `Email: ${form.email}\n` +
      `Additional Notes: ${form.notes || "None"}\n\n` +
      `--- Submitted via blindsideloungeatx.com ---`
    );
    window.location.href = `mailto:blindsidelounge@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 800);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(43,127,255,0.25)",
    color: "#e8eaf0",
    fontFamily: "'Raleway', sans-serif",
    fontWeight: 400,
    fontSize: "0.9rem",
    letterSpacing: "0.05em",
    padding: "14px 18px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          padding: "140px 1.5rem 80px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Neon glow bg */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(43,127,255,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 500,
            fontSize: "0.65rem",
            letterSpacing: "0.45em",
            color: "#2B7FFF",
            textShadow: "0 0 10px rgba(43,127,255,0.7)",
            textTransform: "uppercase",
            marginBottom: "1.2rem",
          }}
        >
          Blindside Lounge · Austin, TX
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
            letterSpacing: "0.2em",
            color: "#e8eaf0",
            textShadow: "0 0 20px rgba(184,196,208,0.3), 0 0 60px rgba(43,127,255,0.2)",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          VIDEO RECORDING
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "clamp(0.9rem, 2vw, 1.3rem)",
            letterSpacing: "0.5em",
            color: "#8B3FBF",
            textShadow: "0 0 12px rgba(139,63,191,0.7)",
            marginBottom: "2.5rem",
          }}
        >
          OF YOUR SET
        </motion.p>

        {/* Price badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: "inline-block",
            border: "1px solid rgba(43,127,255,0.5)",
            padding: "10px 32px",
            marginBottom: "3rem",
            boxShadow: "0 0 20px rgba(43,127,255,0.2), inset 0 0 20px rgba(43,127,255,0.05)",
          }}
        >
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 600,
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            letterSpacing: "0.15em",
            color: "#2B7FFF",
            textShadow: "0 0 15px rgba(43,127,255,0.8)",
          }}>$50.00</span>
        </motion.div>

        {/* Info notices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {[
            "Please include the date and time of your performance in the notes field below.",
            "You will receive a Dropbox download link of your set via email.",
            "All recordings are processed manually — please allow 7–10 days for delivery. Thank you for your patience.",
          ].map((notice, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                background: "rgba(43,127,255,0.05)",
                border: "1px solid rgba(43,127,255,0.15)",
                padding: "12px 16px",
                textAlign: "left",
              }}
            >
              <span style={{ color: "#2B7FFF", fontSize: "0.75rem", marginTop: "2px", flexShrink: 0 }}>◆</span>
              <p style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 400,
                fontSize: "0.82rem",
                letterSpacing: "0.05em",
                color: "rgba(184,196,208,0.75)",
                lineHeight: 1.6,
                margin: 0,
              }}>{notice}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Form ── */}
      <section style={{ padding: "0 1.5rem 100px", maxWidth: "640px", margin: "0 auto" }}>
        {/* Neon divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(43,127,255,0.4))" }} />
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" fill="#2B7FFF" opacity="0.8" />
          </svg>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(43,127,255,0.4))" }} />
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "3rem 2rem",
              border: "1px solid rgba(43,127,255,0.3)",
              background: "rgba(43,127,255,0.05)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✦</div>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 300,
              fontSize: "1.4rem",
              letterSpacing: "0.2em",
              color: "#e8eaf0",
              marginBottom: "1rem",
            }}>ORDER RECEIVED</h2>
            <p style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
              fontSize: "0.9rem",
              color: "rgba(184,196,208,0.7)",
              lineHeight: 1.7,
              letterSpacing: "0.05em",
            }}>
              Thank you. Your recording request has been submitted to blindsidelounge@gmail.com.
              Please allow 7–10 days for processing. You will receive your Dropbox link via email.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label style={{
                display: "block",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "rgba(43,127,255,0.8)",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}>Your Name *</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(43,127,255,0.7)";
                  e.target.style.boxShadow = "0 0 12px rgba(43,127,255,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(43,127,255,0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "rgba(43,127,255,0.8)",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}>Artist / Band Name *</label>
              <input
                type="text"
                name="artistName"
                required
                value={form.artistName}
                onChange={handleChange}
                placeholder="Stage name or band name"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(43,127,255,0.7)";
                  e.target.style.boxShadow = "0 0 12px rgba(43,127,255,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(43,127,255,0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "rgba(43,127,255,0.8)",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}>Date of Performance *</label>
              <input
                type="date"
                name="performanceDate"
                required
                value={form.performanceDate}
                onChange={handleChange}
                style={{ ...inputStyle, colorScheme: "dark" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(43,127,255,0.7)";
                  e.target.style.boxShadow = "0 0 12px rgba(43,127,255,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(43,127,255,0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "rgba(43,127,255,0.8)",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}>Your Email *</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Where we'll send your Dropbox link"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(43,127,255,0.7)";
                  e.target.style.boxShadow = "0 0 12px rgba(43,127,255,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(43,127,255,0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "rgba(43,127,255,0.8)",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}>Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Set time, special instructions, etc."
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(43,127,255,0.7)";
                  e.target.style.boxShadow = "0 0 12px rgba(43,127,255,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(43,127,255,0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Price reminder */}
            <div style={{
              background: "rgba(139,63,191,0.08)",
              border: "1px solid rgba(139,63,191,0.25)",
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                color: "rgba(184,196,208,0.7)",
                textTransform: "uppercase",
              }}>Recording Fee</span>
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "1.1rem",
                letterSpacing: "0.1em",
                color: "#8B3FBF",
                textShadow: "0 0 10px rgba(139,63,191,0.6)",
              }}>$50.00</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 600,
                fontSize: "0.72rem",
                letterSpacing: "0.25em",
                color: "#000",
                background: submitting
                  ? "rgba(43,127,255,0.5)"
                  : "linear-gradient(135deg, #2B7FFF, #8B3FBF)",
                border: "none",
                padding: "16px 32px",
                cursor: submitting ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                boxShadow: "0 0 20px rgba(43,127,255,0.4), 0 0 40px rgba(139,63,191,0.2)",
                transition: "box-shadow 0.25s, transform 0.15s",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 35px rgba(43,127,255,0.7), 0 0 70px rgba(139,63,191,0.4)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(43,127,255,0.4), 0 0 40px rgba(139,63,191,0.2)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {submitting ? "Submitting..." : "Submit Recording Order — $50"}
            </button>

            <p style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
              fontSize: "0.72rem",
              color: "rgba(184,196,208,0.4)",
              textAlign: "center",
              letterSpacing: "0.05em",
              lineHeight: 1.6,
            }}>
              Payment details will be coordinated upon confirmation.
              All recordings processed manually — allow 7–10 days for delivery.
            </p>
          </motion.form>
        )}
      </section>

      <Footer />
    </div>
  );
}
