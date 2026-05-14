/**
 * BLINDSIDE LOUNGE — ARTIST DISCOVERY PAGE
 * Design: Cyberpunk Signal — deep black, electric blue (#2B7FFF), ultraviolet (#8B3FBF)
 * Typography: Cinzel (weight 300) for headings, Inter for body
 * Philosophy: Immersive, cinematic, neon-lit social temple
 * This page positions Blindside as THE place where Austin artists get discovered.
 */

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Reveal on scroll ─────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.75s cubic-bezier(0.23,1,0.32,1) ${delay}s, transform 0.75s cubic-bezier(0.23,1,0.32,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Neon label ───────────────────────────────────────────────────── */
function NeonLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Cinzel', serif",
      fontWeight: 300,
      fontSize: "0.7rem",
      letterSpacing: "0.35em",
      color: "#2B7FFF",
      textShadow: "0 0 12px rgba(43,127,255,0.8)",
      marginBottom: "1rem",
      textTransform: "uppercase",
    }}>{children}</p>
  );
}

/* ── Section heading ─────────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "'Cinzel', serif",
      fontWeight: 300,
      fontSize: "clamp(2rem, 5vw, 3.5rem)",
      letterSpacing: "0.12em",
      color: "#e8eaf0",
      lineHeight: 1.1,
      marginBottom: "1.5rem",
      textTransform: "uppercase",
    }}>{children}</h2>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  HERO SECTION                                                      */
/* ══════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<"perform" | "music" | "slot">("perform");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", genre: "", links: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = formType === "perform" ? "Apply to Perform — Blindside Lounge" :
      formType === "music" ? "Submit Music — Blindside Lounge" : "Reserve a Slot — Blindside Lounge";
    const body = `Name: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AGenre: ${formData.genre}%0ALinks: ${formData.links}%0AMessage: ${formData.message}`;
    window.location.href = `mailto:blindsidetattoos@live.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => { setFormOpen(false); setSubmitted(false); }, 3000);
  };

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      background: "#000",
    }}>
      {/* Hero background image — MDX performer */}
      <img
        src="/manus-storage/i_am_mdx_1738539524_3559449976468692956_61634806768(1)_a9f721f0.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
          opacity: 0.35,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* Dark gradient overlay — ensures text stays readable */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.75) 100%)",
        pointerEvents: "none",
      }} />

      {/* Neon blue tint overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(43,127,255,0.08) 0%, rgba(139,63,191,0.05) 40%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Animated scan lines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(43,127,255,0.012) 2px, rgba(43,127,255,0.012) 4px)",
      }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "8rem 2rem 4rem" }}>
        <Reveal>
          <NeonLabel>Blindside Lounge · Artist Discovery</NeonLabel>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
            letterSpacing: "0.08em",
            color: "#e8eaf0",
            lineHeight: 1.05,
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}>
            Austin's Next<br />
            <span style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(43,127,255,0.9)",
              textShadow: "0 0 40px rgba(43,127,255,0.5), 0 0 80px rgba(43,127,255,0.2)",
            }}>Breakout Artist</span><br />
            Could Be You.
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "rgba(232,234,240,0.65)",
            letterSpacing: "0.05em",
            maxWidth: "560px",
            margin: "0 auto 3rem",
            lineHeight: 1.7,
          }}>
            Blindside Lounge is Austin's stage for emerging talent. Perform live, get discovered, go viral. This isn't just a bar night — it's a launchpad.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Apply to Perform", type: "perform" as const, primary: true },
              { label: "Submit Music", type: "music" as const, primary: false },
              { label: "Reserve a Slot", type: "slot" as const, primary: false },
            ].map(({ label, type, primary }) => (
              <button
                key={type}
                onClick={() => { setFormType(type); setFormOpen(true); }}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 300,
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  border: primary ? "none" : "1px solid rgba(43,127,255,0.5)",
                  background: primary
                    ? "linear-gradient(135deg, #2B7FFF 0%, #8B3FBF 100%)"
                    : "transparent",
                  color: "#e8eaf0",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
                  boxShadow: primary ? "0 0 30px rgba(43,127,255,0.35)" : "none",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = primary
                    ? "0 0 50px rgba(43,127,255,0.55)" : "0 0 20px rgba(43,127,255,0.3)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = primary ? "0 0 30px rgba(43,127,255,0.35)" : "none";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Application Modal */}
      {formOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
          onClick={e => { if (e.target === e.currentTarget) setFormOpen(false); }}
        >
          <div style={{
            background: "rgba(8,8,16,0.98)",
            border: "1px solid rgba(43,127,255,0.25)",
            boxShadow: "0 0 60px rgba(43,127,255,0.15)",
            padding: "2.5rem",
            maxWidth: "520px",
            width: "100%",
            position: "relative",
          }}>
            <button
              onClick={() => setFormOpen(false)}
              style={{
                position: "absolute", top: "1rem", right: "1rem",
                background: "none", border: "none", color: "rgba(232,234,240,0.5)",
                fontSize: "1.2rem", cursor: "pointer",
              }}
            >✕</button>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "1.2rem", letterSpacing: "0.15em", color: "#2B7FFF", textShadow: "0 0 20px rgba(43,127,255,0.6)" }}>
                  APPLICATION SENT
                </p>
                <p style={{ color: "rgba(232,234,240,0.6)", marginTop: "0.5rem", fontSize: "0.9rem" }}>We'll be in touch soon.</p>
              </div>
            ) : (
              <>
                <NeonLabel>
                  {formType === "perform" ? "Apply to Perform" : formType === "music" ? "Submit Music" : "Reserve a Slot"}
                </NeonLabel>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { key: "name", label: "Artist / Stage Name", type: "text", required: true },
                    { key: "email", label: "Email Address", type: "email", required: true },
                    { key: "phone", label: "Phone Number", type: "tel", required: false },
                    { key: "genre", label: "Genre / Style", type: "text", required: true },
                    { key: "links", label: "Music Links (SoundCloud, Spotify, IG, etc.)", type: "text", required: false },
                  ].map(({ key, label, type, required }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(232,234,240,0.5)", marginBottom: "0.4rem", textTransform: "uppercase" }}>{label}</label>
                      <input
                        type={type}
                        required={required}
                        value={(formData as any)[key]}
                        onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(43,127,255,0.2)", color: "#e8eaf0",
                          padding: "0.65rem 0.85rem", fontSize: "0.9rem",
                          outline: "none", fontFamily: "'Inter', sans-serif",
                          boxSizing: "border-box",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={e => (e.target.style.borderColor = "rgba(43,127,255,0.6)")}
                        onBlur={e => (e.target.style.borderColor = "rgba(43,127,255,0.2)")}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(232,234,240,0.5)", marginBottom: "0.4rem", textTransform: "uppercase" }}>Tell Us About Your Act</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(43,127,255,0.2)", color: "#e8eaf0",
                        padding: "0.65rem 0.85rem", fontSize: "0.9rem",
                        outline: "none", fontFamily: "'Inter', sans-serif",
                        resize: "vertical", boxSizing: "border-box",
                      }}
                      onFocus={e => (e.target.style.borderColor = "rgba(43,127,255,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(43,127,255,0.2)")}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      fontFamily: "'Cinzel', serif", fontWeight: 300,
                      fontSize: "0.75rem", letterSpacing: "0.2em",
                      textTransform: "uppercase", padding: "0.9rem",
                      background: "linear-gradient(135deg, #2B7FFF 0%, #8B3FBF 100%)",
                      border: "none", color: "#e8eaf0", cursor: "pointer",
                      boxShadow: "0 0 30px rgba(43,127,255,0.3)",
                      transition: "all 0.25s",
                      marginTop: "0.5rem",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 50px rgba(43,127,255,0.5)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 30px rgba(43,127,255,0.3)")}
                  >
                    Submit Application
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  HOW IT WORKS                                                      */
/* ══════════════════════════════════════════════════════════════════ */
const steps = [
  { num: "01", title: "Sign Up Online", desc: "Submit your application with your music links and genre. Takes 2 minutes." },
  { num: "02", title: "Get Selected", desc: "Our team reviews submissions weekly. Selected artists are notified by email." },
  { num: "03", title: "Perform Live", desc: "Take the Blindside stage in front of a live Austin crowd. Your moment." },
  { num: "04", title: "Crowd Response", desc: "Real-time crowd energy and a panel of judges score your performance." },
  { num: "05", title: "Social Clips Posted", desc: "Professional footage and clips go live on Blindside's social channels." },
  { num: "06", title: "Winners Invited Back", desc: "Top artists earn paid return slots, headliner openings, and more." },
];

function HowItWorksSection() {
  return (
    <section style={{ background: "#000", padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <NeonLabel>The Process</NeonLabel>
          <SectionHeading>How It Works</SectionHeading>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "0",
          marginTop: "3rem",
          border: "1px solid rgba(43,127,255,0.12)",
        }}>
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.08}>
              <div style={{
                padding: "2.5rem",
                borderRight: i % 2 === 0 ? "1px solid rgba(43,127,255,0.12)" : "none",
                borderBottom: i < 4 ? "1px solid rgba(43,127,255,0.12)" : "none",
                position: "relative",
                transition: "background 0.3s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(43,127,255,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* Step number */}
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 300,
                  fontSize: "3.5rem",
                  letterSpacing: "0.05em",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(43,127,255,0.25)",
                  lineHeight: 1,
                  marginBottom: "1rem",
                  userSelect: "none",
                }}>{step.num}</div>
                <h3 style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 300,
                  fontSize: "0.95rem",
                  letterSpacing: "0.18em",
                  color: "#e8eaf0",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}>{step.title}</h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.9rem",
                  color: "rgba(232,234,240,0.55)",
                  lineHeight: 1.7,
                }}>{step.desc}</p>

                {/* Neon corner accent */}
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: "30px", height: "2px",
                  background: "linear-gradient(90deg, #2B7FFF, transparent)",
                  boxShadow: "0 0 8px rgba(43,127,255,0.5)",
                }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  WHO CAN APPLY                                                     */
/* ══════════════════════════════════════════════════════════════════ */
const genres = [
  { label: "Rap", icon: "🎤" },
  { label: "Hip Hop", icon: "🎧" },
  { label: "DJs", icon: "🎛" },
  { label: "EDM", icon: "⚡" },
  { label: "Rock", icon: "🎸" },
  { label: "Latin", icon: "🎺" },
  { label: "Alternative", icon: "🎵" },
  { label: "Experimental", icon: "🔬" },
  { label: "Spoken Word", icon: "🎙" },
];

function WhoCanApplySection() {
  return (
    <section style={{
      background: "linear-gradient(180deg, #000 0%, rgba(8,8,20,1) 100%)",
      padding: "6rem 2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse, rgba(139,63,191,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal>
          <NeonLabel>Open to All</NeonLabel>
          <SectionHeading>Who Can Apply</SectionHeading>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "1rem",
            color: "rgba(232,234,240,0.55)",
            maxWidth: "520px",
            lineHeight: 1.7,
            marginBottom: "3rem",
          }}>
            Blindside is genre-agnostic. If you make music, perform, or move a crowd — you belong on this stage. Austin's most diverse nightlife audience is waiting.
          </p>
        </Reveal>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          {genres.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.06}>
              <div style={{
                padding: "0.9rem 1.8rem",
                border: "1px solid rgba(43,127,255,0.2)",
                background: "rgba(43,127,255,0.04)",
                cursor: "default",
                transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(43,127,255,0.6)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(43,127,255,0.1)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 20px rgba(43,127,255,0.2)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(43,127,255,0.2)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(43,127,255,0.04)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{g.icon}</span>
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 300,
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  color: "#e8eaf0",
                  textTransform: "uppercase",
                }}>{g.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  WHAT WINNERS GET                                                  */
/* ══════════════════════════════════════════════════════════════════ */
const prizes = [
  {
    title: "Paid Return Slot",
    desc: "Top performers earn a paid booking for a future Blindside night.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2B7FFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Headliner Opening",
    desc: "Selected artists get the coveted opening slot for major headliner events.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2B7FFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Studio Sessions",
    desc: "Access to professional studio time through our artist network partnerships.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2B7FFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
  },
  {
    title: "Professional Footage",
    desc: "High-quality video and photo content from your performance, yours to keep.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2B7FFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    title: "Social Promotion",
    desc: "Your clips featured on Blindside's Instagram, TikTok, and social channels.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2B7FFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: "VIP Package",
    desc: "Bottle service, VIP table access, and Blindside hospitality for you and your crew.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2B7FFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      </svg>
    ),
  },
];

function WhatWinnersGetSection() {
  return (
    <section style={{ background: "#000", padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <NeonLabel>The Rewards</NeonLabel>
          <SectionHeading>What Winners Get</SectionHeading>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginTop: "3rem",
        }}>
          {prizes.map((prize, i) => (
            <Reveal key={prize.title} delay={i * 0.1}>
              <div style={{
                padding: "2rem",
                border: "1px solid rgba(43,127,255,0.12)",
                background: "rgba(43,127,255,0.02)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(43,127,255,0.4)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(43,127,255,0.06)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 30px rgba(43,127,255,0.1)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(43,127,255,0.12)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(43,127,255,0.02)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, rgba(43,127,255,0.6), transparent)",
                }} />

                {/* Icon with neon glow */}
                <div style={{
                  width: "52px", height: "52px",
                  border: "1px solid rgba(43,127,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow: "0 0 15px rgba(43,127,255,0.15), inset 0 0 10px rgba(43,127,255,0.05)",
                  background: "rgba(43,127,255,0.05)",
                }}>
                  {prize.icon}
                </div>

                <h3 style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 300,
                  fontSize: "0.85rem",
                  letterSpacing: "0.18em",
                  color: "#e8eaf0",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}>{prize.title}</h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.88rem",
                  color: "rgba(232,234,240,0.55)",
                  lineHeight: 1.7,
                }}>{prize.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  BRAND STATEMENT SECTION                                           */
/* ══════════════════════════════════════════════════════════════════ */
function BrandStatementSection() {
  return (
    <section style={{
      background: "linear-gradient(180deg, #000 0%, rgba(8,8,20,1) 50%, #000 100%)",
      padding: "7rem 2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Neon glow orb */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "500px", height: "300px",
        background: "radial-gradient(ellipse, rgba(43,127,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{
            width: "1px", height: "60px",
            background: "linear-gradient(180deg, transparent, rgba(43,127,255,0.6), transparent)",
            margin: "0 auto 3rem",
            boxShadow: "0 0 10px rgba(43,127,255,0.4)",
          }} />

          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
            letterSpacing: "0.1em",
            color: "#e8eaf0",
            lineHeight: 1.3,
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}>
            The Event Is More Valuable<br />
            <span style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(43,127,255,0.8)",
              textShadow: "0 0 30px rgba(43,127,255,0.4)",
            }}>Than the Bar.</span>
          </h2>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "1.05rem",
            color: "rgba(232,234,240,0.6)",
            lineHeight: 1.85,
            marginBottom: "2.5rem",
          }}>
            When done right, Blindside Artist Discovery creates viral TikTok moments, Instagram clips that spread across Austin, deep artist loyalty, repeat crowds every week, and a cultural identity that no other bar on Sixth Street can replicate.
          </p>

          <p style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "1.1rem",
            letterSpacing: "0.15em",
            color: "#2B7FFF",
            textShadow: "0 0 20px rgba(43,127,255,0.6)",
            textTransform: "uppercase",
          }}>
            "The place where artists get discovered."
          </p>

          <div style={{
            width: "1px", height: "60px",
            background: "linear-gradient(180deg, transparent, rgba(43,127,255,0.6), transparent)",
            margin: "3rem auto 0",
            boxShadow: "0 0 10px rgba(43,127,255,0.4)",
          }} />
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  FINAL CTA                                                         */
/* ══════════════════════════════════════════════════════════════════ */
function FinalCTASection() {
  const [open, setOpen] = useState(false);
  return (
    <section style={{ background: "#000", padding: "6rem 2rem 8rem", textAlign: "center" }}>
      <Reveal>
        <NeonLabel>Ready?</NeonLabel>
        <h2 style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 300,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          letterSpacing: "0.12em",
          color: "#e8eaf0",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
        }}>Take the Stage.</h2>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: "1rem",
          color: "rgba(232,234,240,0.55)",
          marginBottom: "2.5rem",
          maxWidth: "420px",
          margin: "0 auto 2.5rem",
          lineHeight: 1.7,
        }}>
          Applications are reviewed weekly. Slots are limited. Submit yours now and get in front of Austin's most electric nightlife crowd.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "0.8rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            padding: "1.1rem 3rem",
            background: "linear-gradient(135deg, #2B7FFF 0%, #8B3FBF 100%)",
            border: "none",
            color: "#e8eaf0",
            cursor: "pointer",
            boxShadow: "0 0 40px rgba(43,127,255,0.35)",
            transition: "all 0.25s",
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 60px rgba(43,127,255,0.55)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(43,127,255,0.35)")}
        >
          Apply to Perform
        </button>
      </Reveal>

      {open && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
          }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{
            background: "rgba(8,8,16,0.98)",
            border: "1px solid rgba(43,127,255,0.25)",
            boxShadow: "0 0 60px rgba(43,127,255,0.15)",
            padding: "2.5rem", maxWidth: "520px", width: "100%", position: "relative",
          }}>
            <button onClick={() => setOpen(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "rgba(232,234,240,0.5)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            <NeonLabel>Apply to Perform</NeonLabel>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const body = `Name: ${fd.get("name")}%0AEmail: ${fd.get("email")}%0AGenre: ${fd.get("genre")}%0ALinks: ${fd.get("links")}`;
              window.location.href = `mailto:blindsidetattoos@live.com?subject=Apply to Perform — Blindside Lounge&body=${body}`;
              setOpen(false);
            }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[{ name: "name", label: "Artist Name" }, { name: "email", label: "Email" }, { name: "genre", label: "Genre" }, { name: "links", label: "Music Links" }].map(f => (
                <div key={f.name}>
                  <label style={{ display: "block", fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(232,234,240,0.5)", marginBottom: "0.4rem", textTransform: "uppercase" }}>{f.label}</label>
                  <input name={f.name} required style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(43,127,255,0.2)", color: "#e8eaf0", padding: "0.65rem 0.85rem", fontSize: "0.9rem", outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }} />
                </div>
              ))}
              <button type="submit" style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.9rem", background: "linear-gradient(135deg, #2B7FFF 0%, #8B3FBF 100%)", border: "none", color: "#e8eaf0", cursor: "pointer", marginTop: "0.5rem" }}>Submit</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  PAGE EXPORT                                                        */
/* ══════════════════════════════════════════════════════════════════ */
export default function Artists() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Artist Discovery | Blindside Lounge — Austin, TX";
  }, []);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <WhoCanApplySection />
      <WhatWinnersGetSection />
      <BrandStatementSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
