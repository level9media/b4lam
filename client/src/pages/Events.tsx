/**
 * BLINDSIDE LOUNGE — Events Page
 * Design: Dark luxury nightlife — black canvas, electric blue + violet neon
 * Sections: Hero → Featured Event → Upcoming Events Grid → Monthly Calendar → Newsletter CTA
 * SEO: Targets "Austin nightlife events", "DJ nights Austin", "bars on Sixth Street Austin"
 */

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Fade-up reveal wrapper ───────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Neon divider ─────────────────────────────────────────── */
function NeonDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0 auto 2.5rem", maxWidth: "300px" }}>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(43,127,255,0.5))" }} />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" fill="#2B7FFF" opacity="0.8" />
      </svg>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(43,127,255,0.5))" }} />
    </div>
  );
}

/* ── Event data ───────────────────────────────────────────── */
const FEATURED_EVENT = {
  date: "SAT, MAY 31",
  title: "NEON FREQUENCIES",
  subtitle: "An Immersive Electronic Night",
  description:
    "Blindside Lounge transforms into a pulsing neon sanctuary. Three DJs. Immersive lighting. Signature cocktails. Limited capacity — this one sells out. Doors open at 9PM, music until 2AM.",
  djs: ["DJ PARADOX", "STASIA REIGN", "LILN8O"],
  time: "9:00 PM — 2:00 AM",
  cover: "$15 advance / $20 door",
  rsvp: "mailto:blindsidetattoos@live.com?subject=RSVP%20%E2%80%94%20Neon%20Frequencies%20May%2031",
  tag: "FEATURED",
  color: "#2B7FFF",
};

const UPCOMING_EVENTS = [
  {
    id: 1,
    date: "FRI, MAY 23",
    day: "FRI",
    month: "MAY",
    num: "23",
    title: "FRIDAY FREQUENCY",
    genre: "Hip Hop · R&B · Trap",
    dj: "DJ 4000 CJ",
    time: "9 PM – 2 AM",
    cover: "No Cover Before 10PM",
    tag: "WEEKLY",
    color: "#8B3FBF",
    rsvp: "mailto:blindsidetattoos@live.com?subject=RSVP%20%E2%80%94%20Friday%20Frequency%20May%2023",
  },
  {
    id: 2,
    date: "SAT, MAY 24",
    day: "SAT",
    month: "MAY",
    num: "24",
    title: "LATIN HEAT",
    genre: "Reggaeton · Latin Trap · Salsa",
    dj: "DJ BIG XODIA",
    time: "9 PM – 2 AM",
    cover: "$10 Cover",
    tag: "SPECIAL",
    color: "#2B7FFF",
    rsvp: "mailto:blindsidetattoos@live.com?subject=RSVP%20%E2%80%94%20Latin%20Heat%20May%2024",
  },
  {
    id: 3,
    date: "FRI, MAY 30",
    day: "FRI",
    month: "MAY",
    num: "30",
    title: "UNDERGROUND SESSIONS",
    genre: "EDM · House · Techno",
    dj: "BIG CHIEF LEW",
    time: "10 PM – 3 AM",
    cover: "$12 Cover",
    tag: "WEEKLY",
    color: "#8B3FBF",
    rsvp: "mailto:blindsidetattoos@live.com?subject=RSVP%20%E2%80%94%20Underground%20Sessions%20May%2030",
  },
  {
    id: 4,
    date: "SAT, MAY 31",
    day: "SAT",
    month: "MAY",
    num: "31",
    title: "NEON FREQUENCIES",
    genre: "Electronic · Experimental · Ambient",
    dj: "PARADOX + STASIA REIGN",
    time: "9 PM – 2 AM",
    cover: "$15 Advance / $20 Door",
    tag: "FEATURED",
    color: "#2B7FFF",
    rsvp: "mailto:blindsidetattoos@live.com?subject=RSVP%20%E2%80%94%20Neon%20Frequencies%20May%2031",
  },
  {
    id: 5,
    date: "FRI, JUN 6",
    day: "FRI",
    month: "JUN",
    num: "6",
    title: "FRIDAY FREQUENCY",
    genre: "Hip Hop · R&B · Afrobeats",
    dj: "LOST N FOUND",
    time: "9 PM – 2 AM",
    cover: "No Cover Before 10PM",
    tag: "WEEKLY",
    color: "#8B3FBF",
    rsvp: "mailto:blindsidetattoos@live.com?subject=RSVP%20%E2%80%94%20Friday%20Frequency%20Jun%206",
  },
  {
    id: 6,
    date: "SAT, JUN 7",
    day: "SAT",
    month: "JUN",
    num: "7",
    title: "BLINDSIDE TAKEOVER",
    genre: "All Genres · Open Format",
    dj: "KIMBERBATCH + GUESTS",
    time: "9 PM – 3 AM",
    cover: "$20 Cover",
    tag: "SPECIAL",
    color: "#2B7FFF",
    rsvp: "mailto:blindsidetattoos@live.com?subject=RSVP%20%E2%80%94%20Blindside%20Takeover%20Jun%207",
  },
  {
    id: 7,
    date: "FRI, JUN 13",
    day: "FRI",
    month: "JUN",
    num: "13",
    title: "FRIDAY 13TH SPECIAL",
    genre: "Dark Electronic · Industrial · EBM",
    dj: "DARKAOSPIXY",
    time: "10 PM – 3 AM",
    cover: "$13 Cover",
    tag: "SPECIAL",
    color: "#8B3FBF",
    rsvp: "mailto:blindsidetattoos@live.com?subject=RSVP%20%E2%80%94%20Friday%2013th%20Jun%2013",
  },
  {
    id: 8,
    date: "SAT, JUN 21",
    day: "SAT",
    month: "JUN",
    num: "21",
    title: "SUMMER SOLSTICE",
    genre: "House · Tropical · Disco",
    dj: "I AM MDX",
    time: "8 PM – 2 AM",
    cover: "$15 Cover",
    tag: "SPECIAL",
    color: "#2B7FFF",
    rsvp: "mailto:blindsidetattoos@live.com?subject=RSVP%20%E2%80%94%20Summer%20Solstice%20Jun%2021",
  },
];

const TAG_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  FEATURED: { bg: "rgba(43,127,255,0.15)", text: "#2B7FFF", glow: "rgba(43,127,255,0.4)" },
  WEEKLY:   { bg: "rgba(139,63,191,0.12)", text: "#8B3FBF", glow: "rgba(139,63,191,0.35)" },
  SPECIAL:  { bg: "rgba(43,127,255,0.08)", text: "#60a5fa", glow: "rgba(96,165,250,0.3)" },
};

/* ═══════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "55vh",
        display: "flex",
        alignItems: "flex-end",
        paddingBottom: "4rem",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Background — lounge photo */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(/manus-storage/VIEWOFLOUNGE_a6e0c0c5.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: 0.28,
        }}
      />
      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 60%, #000 100%)" }} />

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(43,127,255,0.015) 2px, rgba(43,127,255,0.015) 4px)",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <p style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.6rem",
            letterSpacing: "0.5em", color: "#2B7FFF",
            textShadow: "0 0 20px rgba(43,127,255,0.8)", textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            Austin's Neon Sanctuary · 211 E. 6th St
          </p>
          <h1 style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#e8eaf0", lineHeight: 1.05, marginBottom: "1rem",
          }}>
            EVENTS &<br />
            <span style={{ color: "#2B7FFF", textShadow: "0 0 40px rgba(43,127,255,0.6)" }}>NIGHTLIFE</span>
          </h1>
          <p style={{
            fontFamily: "'Raleway', sans-serif", fontWeight: 300,
            fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
            color: "rgba(184,196,208,0.65)", letterSpacing: "0.08em",
            maxWidth: "520px",
          }}>
            DJ nights, themed events, and immersive experiences every weekend on Historic Sixth Street in Austin, Texas.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FEATURED EVENT
   ═══════════════════════════════════════════════════════════ */
function FeaturedEventSection() {
  const ev = FEATURED_EVENT;
  return (
    <section style={{ background: "#000", padding: "5rem 0 3rem" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.58rem", letterSpacing: "0.45em", color: "#2B7FFF", textShadow: "0 0 12px rgba(43,127,255,0.7)", textTransform: "uppercase", marginBottom: "0.6rem" }}>Next Big Night</p>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.15em", color: "#e8eaf0", textTransform: "uppercase" }}>Featured Event</h2>
          </div>
        </Reveal>
        <NeonDivider />

        <Reveal delay={0.1}>
          <div style={{
            position: "relative",
            border: "1px solid rgba(43,127,255,0.3)",
            background: "rgba(6,6,20,0.98)",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
          }}>
            {/* Glow top border */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #2B7FFF, #8B3FBF, transparent)" }} />

            {/* Left — date/info */}
            <div style={{ padding: "3.5rem 3rem", borderRight: "1px solid rgba(43,127,255,0.12)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{
                display: "inline-block", fontFamily: "'Cinzel', serif", fontWeight: 300,
                fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase",
                color: ev.color, background: "rgba(43,127,255,0.1)",
                border: `1px solid ${ev.color}40`, padding: "0.3rem 0.8rem",
                marginBottom: "1.5rem", alignSelf: "flex-start",
                boxShadow: `0 0 12px ${ev.color}30`,
              }}>{ev.tag}</span>

              <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)", letterSpacing: "0.3em", color: "rgba(184,196,208,0.5)", textTransform: "uppercase", marginBottom: "0.5rem" }}>{ev.date}</p>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "0.08em", color: "#e8eaf0", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "0.4rem" }}>{ev.title}</h3>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, fontSize: "0.85rem", letterSpacing: "0.15em", color: "#8B3FBF", textShadow: "0 0 8px rgba(139,63,191,0.5)", marginBottom: "1.5rem" }}>{ev.subtitle}</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, fontSize: "0.88rem", color: "rgba(184,196,208,0.55)", lineHeight: 1.7, marginBottom: "2rem" }}>{ev.description}</p>

              <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                {[["TIME", ev.time], ["COVER", ev.cover]].map(([label, val]) => (
                  <div key={label}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.5rem", letterSpacing: "0.35em", color: "rgba(184,196,208,0.35)", textTransform: "uppercase", marginBottom: "0.25rem" }}>{label}</p>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 400, fontSize: "0.88rem", color: "#e8eaf0" }}>{val}</p>
                  </div>
                ))}
              </div>

              <a
                href={ev.rsvp}
                style={{
                  display: "inline-block", fontFamily: "'Cinzel', serif", fontWeight: 300,
                  fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
                  padding: "0.9rem 2.2rem", textDecoration: "none",
                  background: "linear-gradient(135deg, #2B7FFF 0%, #8B3FBF 100%)",
                  color: "#e8eaf0", border: "none",
                  boxShadow: "0 0 30px rgba(43,127,255,0.3)",
                  transition: "box-shadow 0.25s, transform 0.15s",
                  alignSelf: "flex-start",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 50px rgba(43,127,255,0.55)"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(43,127,255,0.3)"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
              >
                RSVP Now
              </a>
            </div>

            {/* Right — DJs */}
            <div style={{ padding: "3.5rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center", background: "rgba(43,127,255,0.02)" }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.55rem", letterSpacing: "0.4em", color: "rgba(184,196,208,0.35)", textTransform: "uppercase", marginBottom: "2rem" }}>Performing Artists</p>
              {ev.djs.map((dj, i) => (
                <div key={dj} style={{
                  display: "flex", alignItems: "center", gap: "1.25rem",
                  padding: "1.25rem 0",
                  borderBottom: i < ev.djs.length - 1 ? "1px solid rgba(43,127,255,0.08)" : "none",
                }}>
                  <div style={{
                    width: 44, height: 44, flexShrink: 0,
                    border: "1px solid rgba(43,127,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(43,127,255,0.06)",
                  }}>
                    <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.7rem", color: "#2B7FFF" }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "clamp(0.9rem, 2vw, 1.15rem)", letterSpacing: "0.15em", color: "#e8eaf0", textTransform: "uppercase" }}>{dj}</p>
                  </div>
                </div>
              ))}

              {/* Sigil watermark */}
              <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center" }}>
                <img
                  src="/manus-storage/logo_11eca033.webp"
                  alt="Blindside Sigil"
                  style={{ width: 80, height: 80, objectFit: "contain", opacity: 0.08, filter: "drop-shadow(0 0 20px rgba(43,127,255,0.4))" }}
                />
              </div>
            </div>

            {/* Corner accents */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 24, height: 24, borderTop: "1px solid #2B7FFF", borderLeft: "1px solid #2B7FFF" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderBottom: "1px solid #8B3FBF", borderRight: "1px solid #8B3FBF" }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   UPCOMING EVENTS GRID
   ═══════════════════════════════════════════════════════════ */
function UpcomingEventsSection() {
  const [filter, setFilter] = useState("ALL");
  const filters = ["ALL", "WEEKLY", "SPECIAL", "FEATURED"];

  const filtered = filter === "ALL" ? UPCOMING_EVENTS : UPCOMING_EVENTS.filter(e => e.tag === filter);

  return (
    <section style={{ background: "#000", padding: "4rem 0 6rem" }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.58rem", letterSpacing: "0.45em", color: "#8B3FBF", textShadow: "0 0 12px rgba(139,63,191,0.7)", textTransform: "uppercase", marginBottom: "0.6rem" }}>May — June 2025</p>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.15em", color: "#e8eaf0", textTransform: "uppercase" }}>Upcoming Events</h2>
          </div>
        </Reveal>
        <NeonDivider />

        {/* Filter tabs */}
        <Reveal delay={0.05}>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "3rem", flexWrap: "wrap" }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.55rem",
                  letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer",
                  padding: "0.55rem 1.4rem",
                  background: filter === f ? "linear-gradient(135deg, #2B7FFF, #8B3FBF)" : "transparent",
                  color: filter === f ? "#e8eaf0" : "rgba(184,196,208,0.45)",
                  border: filter === f ? "1px solid transparent" : "1px solid rgba(43,127,255,0.2)",
                  boxShadow: filter === f ? "0 0 20px rgba(43,127,255,0.3)" : "none",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => { if (filter !== f) (e.currentTarget as HTMLButtonElement).style.color = "#2B7FFF"; }}
                onMouseLeave={e => { if (filter !== f) (e.currentTarget as HTMLButtonElement).style.color = "rgba(184,196,208,0.45)"; }}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Events grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filtered.map((ev, i) => {
            const tagStyle = TAG_COLORS[ev.tag] || TAG_COLORS.WEEKLY;
            return (
              <Reveal key={ev.id} delay={i * 0.06}>
                <div
                  style={{
                    position: "relative",
                    background: "rgba(6,6,20,0.97)",
                    border: "1px solid rgba(43,127,255,0.12)",
                    padding: "2rem",
                    overflow: "hidden",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    cursor: "default",
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${ev.color}50`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${ev.color}18`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(43,127,255,0.12)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  {/* Top accent line */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, transparent, ${ev.color}60, transparent)` }} />

                  {/* Date badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                    <div style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      background: "rgba(43,127,255,0.06)", border: `1px solid ${ev.color}30`,
                      padding: "0.6rem 0.9rem", minWidth: 56,
                    }}>
                      <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(184,196,208,0.45)", textTransform: "uppercase" }}>{ev.month}</span>
                      <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "1.6rem", color: ev.color, lineHeight: 1, textShadow: `0 0 15px ${ev.color}70` }}>{ev.num}</span>
                      <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(184,196,208,0.45)", textTransform: "uppercase" }}>{ev.day}</span>
                    </div>
                    <span style={{
                      fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.48rem",
                      letterSpacing: "0.3em", textTransform: "uppercase",
                      color: tagStyle.text, background: tagStyle.bg,
                      border: `1px solid ${tagStyle.text}40`,
                      padding: "0.25rem 0.65rem",
                      boxShadow: `0 0 8px ${tagStyle.glow}`,
                    }}>{ev.tag}</span>
                  </div>

                  <h3 style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "clamp(1rem, 2vw, 1.25rem)", letterSpacing: "0.1em", color: "#e8eaf0", textTransform: "uppercase", marginBottom: "0.4rem" }}>{ev.title}</h3>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, fontSize: "0.78rem", color: ev.color, textShadow: `0 0 8px ${ev.color}50`, letterSpacing: "0.08em", marginBottom: "0.35rem" }}>{ev.genre}</p>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 400, fontSize: "0.82rem", color: "rgba(184,196,208,0.55)", marginBottom: "1.5rem" }}>
                    <span style={{ color: "rgba(184,196,208,0.35)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>DJ · </span>{ev.dj}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(43,127,255,0.08)", paddingTop: "1.25rem" }}>
                    <div>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, fontSize: "0.75rem", color: "rgba(184,196,208,0.4)" }}>{ev.time}</p>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 400, fontSize: "0.75rem", color: "rgba(184,196,208,0.6)" }}>{ev.cover}</p>
                    </div>
                    <a
                      href={ev.rsvp}
                      style={{
                        fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.52rem",
                        letterSpacing: "0.25em", textTransform: "uppercase",
                        padding: "0.55rem 1.2rem", textDecoration: "none",
                        border: `1px solid ${ev.color}50`, color: ev.color,
                        background: `${ev.color}08`,
                        transition: "all 0.25s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = `${ev.color}20`;
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 15px ${ev.color}30`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = `${ev.color}08`;
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                      }}
                    >
                      RSVP
                    </a>
                  </div>

                  {/* Corner accent */}
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: `1px solid ${ev.color}40`, borderRight: `1px solid ${ev.color}40` }} />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRIVATE EVENTS CTA
   ═══════════════════════════════════════════════════════════ */
function PrivateEventsCTA() {
  return (
    <section style={{ background: "#000", padding: "0 0 6rem" }}>
      <div className="container">
        <Reveal>
          <div style={{
            position: "relative",
            background: "linear-gradient(135deg, rgba(43,127,255,0.06) 0%, rgba(139,63,191,0.06) 100%)",
            border: "1px solid rgba(43,127,255,0.18)",
            padding: "4rem 3rem",
            textAlign: "center",
            overflow: "hidden",
          }}>
            {/* Glow lines */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #2B7FFF, #8B3FBF, transparent)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #8B3FBF, #2B7FFF, transparent)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: 24, height: 24, borderTop: "1px solid #2B7FFF", borderLeft: "1px solid #2B7FFF" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderBottom: "1px solid #8B3FBF", borderRight: "1px solid #8B3FBF" }} />

            {/* Sigil watermark */}
            <img src="/manus-storage/logo_11eca033.webp" alt="" aria-hidden="true"
              style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", width: 160, height: 160, objectFit: "contain", opacity: 0.04, filter: "drop-shadow(0 0 30px rgba(43,127,255,0.3))" }}
            />

            <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "0.58rem", letterSpacing: "0.45em", color: "#2B7FFF", textShadow: "0 0 12px rgba(43,127,255,0.7)", textTransform: "uppercase", marginBottom: "1rem" }}>Private & Corporate</p>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "clamp(1.4rem, 3.5vw, 2.5rem)", letterSpacing: "0.1em", color: "#e8eaf0", textTransform: "uppercase", marginBottom: "1rem" }}>Host Your Event at Blindside</h2>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, fontSize: "clamp(0.85rem, 1.5vw, 1rem)", color: "rgba(184,196,208,0.55)", maxWidth: "560px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
              Full venue buyouts, corporate events, birthday celebrations, brand activations, and VIP experiences. Austin's most immersive private event space on Historic Sixth Street.
            </p>
            <a
              href="mailto:blindsidetattoos@live.com?subject=Private%20Event%20Inquiry"
              style={{
                display: "inline-block", fontFamily: "'Cinzel', serif", fontWeight: 300,
                fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
                padding: "1rem 2.5rem", textDecoration: "none",
                background: "linear-gradient(135deg, #2B7FFF 0%, #8B3FBF 100%)",
                color: "#e8eaf0",
                boxShadow: "0 0 30px rgba(43,127,255,0.3)",
                transition: "box-shadow 0.25s, transform 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 50px rgba(43,127,255,0.55)"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(43,127,255,0.3)"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
            >
              Inquire About Private Events
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════════════════════ */
export default function Events() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <FeaturedEventSection />
      <UpcomingEventsSection />
      <PrivateEventsCTA />
      <Footer />
    </div>
  );
}
