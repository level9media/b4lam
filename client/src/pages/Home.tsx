/**
 * BLINDSIDE LOUNGE — Home Page
 * Design: Dark luxury nightlife — black canvas, electric blue + violet neon
 * Sections: Splash → Video Hero → Experience → Cocktails → Events → Gallery → Reserve
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
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
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Section divider ──────────────────────────────────────── */
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

/* ── Section heading ──────────────────────────────────────── */
function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
      <p style={{
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 500,
        fontSize: "0.65rem",
        letterSpacing: "0.4em",
        color: "#2B7FFF",
        textShadow: "0 0 8px rgba(43,127,255,0.6)",
        textTransform: "uppercase",
        marginBottom: "0.75rem",
      }}>{label}</p>
      <h2 style={{
        fontFamily: "'Cinzel', serif",
        fontWeight: 700,
        fontSize: "clamp(1.8rem, 4vw, 3rem)",
        letterSpacing: "0.15em",
        color: "#e8eaf0",
        textShadow: "0 0 20px rgba(43,127,255,0.2), 0 0 60px rgba(139,63,191,0.15)",
        marginBottom: "1rem",
        lineHeight: 1.1,
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 300,
          fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
          color: "rgba(184,196,208,0.6)",
          maxWidth: "540px",
          margin: "0 auto",
          lineHeight: 1.8,
          letterSpacing: "0.03em",
        }}>{subtitle}</p>
      )}
      <NeonDivider />
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */
export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {!splashDone && <SplashScreen onEnter={() => setSplashDone(true)} />}

      {splashDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Navbar />
          <HeroSection />
          <ExperienceSection />
          <CocktailsSection />
          <EventsSection />
          <GallerySection />
          <ReserveSection />
          <Footer />
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO SECTION — Video background + neon headline
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "600px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          transform: "scale(1.03)",
        }}
      >
        <source src="/manus-storage/hero-video_851c6ade.mp4" type="video/mp4" />
        {/* Fallback image if video fails */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/manus-storage/lounge3_41607289.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />
      </video>

      {/* Gradient overlays */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%)",
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, rgba(43,127,255,0.06) 0%, transparent 65%)",
      }} />

      {/* Scanlines */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "0 1.5rem" }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(0.6rem, 1.2vw, 0.75rem)",
            letterSpacing: "0.5em",
            color: "#2B7FFF",
            textShadow: "0 0 12px rgba(43,127,255,0.8)",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          Austin, Texas · East 6th Street
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "clamp(3rem, 10vw, 8rem)",
            letterSpacing: "0.22em",
            color: "#e8eaf0",
            textShadow: "0 0 20px rgba(184,196,208,0.4), 0 0 60px rgba(43,127,255,0.25), 0 0 120px rgba(139,63,191,0.15)",
            lineHeight: 0.9,
            marginBottom: "0.5rem",
          }}
        >
          BLINDSIDE
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", marginBottom: "0.5rem" }}
        >
          <div style={{ height: "1px", width: "clamp(60px, 8vw, 120px)", background: "linear-gradient(to right, transparent, #8B3FBF)" }} />
          <span           style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "clamp(0.9rem, 2.5vw, 1.6rem)",
            letterSpacing: "0.75em",
            color: "#8B3FBF",
            textShadow: "0 0 10px rgba(139,63,191,0.8), 0 0 25px rgba(139,63,191,0.4)",
          }}>LOUNGE</span>
          <div style={{ height: "1px", width: "clamp(60px, 8vw, 120px)", background: "linear-gradient(to left, transparent, #8B3FBF)" }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
            letterSpacing: "0.25em",
            color: "rgba(184,196,208,0.55)",
            fontStyle: "italic",
            marginBottom: "3rem",
          }}
        >
          Upscale. Inviting. Unforgettable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <a
            href="#reserve"
            onClick={(e) => { e.preventDefault(); document.querySelector("#reserve")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 600,
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              color: "#000",
              background: "linear-gradient(135deg, #2B7FFF, #8B3FBF)",
              padding: "14px 32px",
              textDecoration: "none",
              textTransform: "uppercase",
              boxShadow: "0 0 20px rgba(43,127,255,0.5), 0 0 40px rgba(139,63,191,0.3)",
              transition: "box-shadow 0.25s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 35px rgba(43,127,255,0.8), 0 0 70px rgba(139,63,191,0.5)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(43,127,255,0.5), 0 0 40px rgba(139,63,191,0.3)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Reserve a Table
          </a>
          <a
            href="#experience"
            onClick={(e) => { e.preventDefault(); document.querySelector("#experience")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 500,
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              color: "rgba(184,196,208,0.8)",
              border: "1px solid rgba(43,127,255,0.4)",
              padding: "14px 32px",
              textDecoration: "none",
              textTransform: "uppercase",
              boxShadow: "0 0 10px rgba(43,127,255,0.15), inset 0 0 10px rgba(43,127,255,0.05)",
              transition: "border-color 0.25s, box-shadow 0.25s, color 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,127,255,0.8)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(43,127,255,0.3), inset 0 0 20px rgba(43,127,255,0.08)";
              (e.currentTarget as HTMLElement).style.color = "#2B7FFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,127,255,0.4)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 10px rgba(43,127,255,0.15), inset 0 0 10px rgba(43,127,255,0.05)";
              (e.currentTarget as HTMLElement).style.color = "rgba(184,196,208,0.8)";
            }}
          >
            Explore
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator — Blindside sigil watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <motion.img
          src="/manus-storage/logo_11eca033.webp"
          alt=""
          animate={{ y: [0, 8, 0], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "90px",
            height: "90px",
            objectFit: "contain",
            filter: "brightness(1.4) saturate(1.2) drop-shadow(0 0 10px rgba(43,127,255,0.4))",
            opacity: 0.22,
          }}
        />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE SECTION
   ═══════════════════════════════════════════════════════════ */
/* Neon SVG icons — each renders as a glowing neon-sign style illustration */
const NeonCocktailIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="glow-c">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <g filter="url(#glow-c)">
      <path d="M8 6 L36 6 L24 24 L24 38 L20 38 L20 24 Z" stroke="#2B7FFF" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <circle cx="22" cy="38" r="5" stroke="#2B7FFF" strokeWidth="1.5" fill="none"/>
      <path d="M8 14 L36 14" stroke="rgba(43,127,255,0.5)" strokeWidth="1" strokeDasharray="2 3"/>
      <circle cx="28" cy="10" r="2" fill="#2B7FFF" opacity="0.9"/>
    </g>
  </svg>
);

const NeonDJIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="glow-d">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <g filter="url(#glow-d)">
      <circle cx="22" cy="22" r="14" stroke="#8B3FBF" strokeWidth="1.5" fill="none"/>
      <circle cx="22" cy="22" r="4" stroke="#8B3FBF" strokeWidth="1.5" fill="none"/>
      <circle cx="22" cy="22" r="8" stroke="rgba(139,63,191,0.4)" strokeWidth="1" strokeDasharray="3 4" fill="none"/>
      <line x1="22" y1="8" x2="22" y2="14" stroke="#8B3FBF" strokeWidth="1.5"/>
      <line x1="22" y1="30" x2="22" y2="36" stroke="#8B3FBF" strokeWidth="1.5"/>
      <line x1="8" y1="22" x2="14" y2="22" stroke="#8B3FBF" strokeWidth="1.5"/>
      <line x1="30" y1="22" x2="36" y2="22" stroke="#8B3FBF" strokeWidth="1.5"/>
    </g>
  </svg>
);

const NeonBottleIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="glow-b">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <g filter="url(#glow-b)">
      <path d="M17 6 L17 12 C12 15 10 20 10 26 C10 34 14 38 22 38 C30 38 34 34 34 26 C34 20 32 15 27 12 L27 6 Z" stroke="#2B7FFF" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <line x1="17" y1="6" x2="27" y2="6" stroke="#2B7FFF" strokeWidth="1.5"/>
      <path d="M13 24 Q22 20 31 24" stroke="rgba(43,127,255,0.5)" strokeWidth="1" fill="none"/>
      <circle cx="22" cy="30" r="3" stroke="rgba(43,127,255,0.7)" strokeWidth="1" fill="none"/>
    </g>
  </svg>
);

const NeonCorporateIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="glow-e">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <g filter="url(#glow-e)">
      <rect x="6" y="14" width="32" height="22" rx="1" stroke="#2B7FFF" strokeWidth="1.5" fill="none"/>
      <path d="M14 14 L14 10 C14 8 16 7 18 7 L26 7 C28 7 30 8 30 10 L30 14" stroke="#2B7FFF" strokeWidth="1.5" fill="none"/>
      <line x1="6" y1="22" x2="38" y2="22" stroke="rgba(43,127,255,0.5)" strokeWidth="1"/>
      <line x1="22" y1="22" x2="22" y2="36" stroke="rgba(43,127,255,0.4)" strokeWidth="1"/>
      <circle cx="22" cy="22" r="2.5" fill="#2B7FFF" opacity="0.9"/>
      <line x1="10" y1="28" x2="18" y2="28" stroke="rgba(43,127,255,0.4)" strokeWidth="1"/>
      <line x1="26" y1="28" x2="34" y2="28" stroke="rgba(43,127,255,0.4)" strokeWidth="1"/>
    </g>
  </svg>
);

function ExperienceSection() {
  const features = [
    {
      icon: <NeonCocktailIcon />,
      title: "Craft Cocktails",
      desc: "Handcrafted cocktails inspired by Mesoamerican culture and modern mixology. Every pour is a ritual.",
      glowColor: "rgba(43,127,255,0.15)",
    },
    {
      icon: <NeonDJIcon />,
      title: "Live DJs",
      desc: "Austin's top selectors spinning across hip-hop, Latin, electronic, and beyond every weekend.",
      glowColor: "rgba(139,63,191,0.15)",
    },
    {
      icon: <NeonBottleIcon />,
      title: "Bottle Service",
      desc: "Elevated VIP experiences with premium bottle packages and dedicated service for your crew.",
      glowColor: "rgba(43,127,255,0.15)",
    },
    {
      icon: <NeonCorporateIcon />,
      title: "Corporate & Private Events",
      desc: "Transform Blindside into your exclusive venue. Full buyouts, branded experiences, and premium hospitality for corporate events, launch parties, and private celebrations.",
      glowColor: "rgba(43,127,255,0.15)",
    },
  ];

  return (
    <section
      id="experience"
      style={{
        background: "#000000",
        padding: "7rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px",
        height: "400px",
        background: "radial-gradient(ellipse, rgba(43,127,255,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container">
        <Reveal>
          <SectionHeading
            label="The Experience"
            title="WHERE EVERY NIGHT IS ELECTRIC"
            subtitle="Blindside Lounge is Austin's most immersive nightlife destination — where craft cocktails, world-class music, and ancient art collide on East 6th Street."
          />
        </Reveal>

        {/* Feature grid — 4 equal columns, no overflow artifacts */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0",
          border: "1px solid rgba(43,127,255,0.12)",
          overflow: "hidden",
        }}>
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div
                style={{
                  background: "#06060e",
                  padding: "2.5rem 2rem",
                  borderRight: i < features.length - 1 ? "1px solid rgba(43,127,255,0.12)" : "none",
                  transition: "background 0.3s ease",
                  cursor: "default",
                  height: "100%",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(43,127,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#06060e";
                }}
              >
                {/* Neon icon with glow halo */}
                <div style={{
                  marginBottom: "1.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "64px",
                  height: "64px",
                  borderRadius: "2px",
                  background: f.glowColor,
                  boxShadow: `0 0 20px ${f.glowColor}, inset 0 0 20px rgba(43,127,255,0.05)`,
                  border: "1px solid rgba(43,127,255,0.2)",
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  letterSpacing: "0.2em",
                  color: "#e8eaf0",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                  lineHeight: 1.4,
                }}>{f.title}</h3>
                <p style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.83rem",
                  color: "rgba(184,196,208,0.6)",
                  lineHeight: 1.85,
                  margin: 0,
                }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Full-width venue image */}
        <Reveal delay={0.2}>
          <div style={{
            marginTop: "4rem",
            position: "relative",
            overflow: "hidden",
            height: "clamp(300px, 45vw, 520px)",
          }}>
            {/* Autoplay looping section video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                display: "block",
              }}
            >
              <source src="/manus-storage/section-video_ce8c8b47.mp4" type="video/mp4" />
            </video>
            {/* Dark vignette overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.45) 100%)",
              pointerEvents: "none",
            }} />
            {/* Bottom fade to black */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "120px",
              background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.85))",
              pointerEvents: "none",
            }} />
            {/* Overlay text */}
            <div style={{
              position: "absolute",
              bottom: "2.5rem",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <p style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 300,
                fontSize: "clamp(1.1rem, 3vw, 1.9rem)",
                letterSpacing: "0.25em",
                color: "#e8eaf0",
                textShadow: "0 0 30px rgba(43,127,255,0.6), 0 0 60px rgba(43,127,255,0.3)",
              }}>ELEVATED · ENERGY · CONNECTION</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   COCKTAILS SECTION
   ═══════════════════════════════════════════════════════════ */
function CocktailsSection() {
  const drinks = [
    {
      name: "El Cafesito",
      subtitle: "Guatemalan Espresso Martini",
      desc: "Zacapa rum, cold brew, vanilla, a cinnamon curl. The house signature.",
      img: "/manus-storage/drink1_fbdbd55f.jpg",
    },
    {
      name: "La Serpiente",
      subtitle: "Mezcal Sour",
      desc: "Artisanal mezcal, fresh citrus, agave, activated charcoal rim.",
      img: "/manus-storage/drink2_3d9ea3d4.jpg",
    },
    {
      name: "El Oráculo",
      subtitle: "Blue Butterfly Margarita",
      desc: "Reposado tequila, butterfly pea flower, fresh lime, salted rim.",
      img: "/manus-storage/rearbar_06c68643.jpg",
    },
  ];

  return (
    <section
      id="cocktails"
      style={{
        background: "linear-gradient(180deg, #000 0%, #050510 50%, #000 100%)",
        padding: "7rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Neon accent line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(43,127,255,0.4), rgba(139,63,191,0.4), transparent)",
      }} />

      <div className="container">
        <Reveal>
          <SectionHeading
            label="Craft Cocktails"
            title="THE ART OF THE POUR"
            subtitle="Every cocktail is a story rooted in Mesoamerican heritage and Austin's vibrant culture. Sip something unforgettable."
          />
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2px",
          background: "rgba(139,63,191,0.08)",
        }}>
          {drinks.map((drink, i) => (
            <Reveal key={drink.name} delay={i * 0.12}>
              <div
                style={{
                  background: "#000",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ position: "relative", height: "320px", overflow: "hidden" }}>
                  <img
                    src={drink.img}
                    alt={drink.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
                  }} />
                </div>
                <div style={{ padding: "1.75rem" }}>
                  <p style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.6rem",
                    letterSpacing: "0.35em",
                    color: "#8B3FBF",
                    textShadow: "0 0 8px rgba(139,63,191,0.6)",
                    textTransform: "uppercase",
                    marginBottom: "0.4rem",
                  }}>{drink.subtitle}</p>
                  <h3 style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    letterSpacing: "0.1em",
                    color: "#e8eaf0",
                    marginBottom: "0.75rem",
                  }}>{drink.name}</h3>
                  <p style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.82rem",
                    color: "rgba(184,196,208,0.55)",
                    lineHeight: 1.7,
                  }}>{drink.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EVENTS SECTION
   ═══════════════════════════════════════════════════════════ */
function EventsSection() {
  const events = [
    { day: "Thursday", name: "Open Decks ATX", desc: "Austin's coolest weekly open decks night. Any genre, any vibe.", tag: "Weekly" },
    { day: "Friday", name: "Noche Latina", desc: "Latin rhythms, reggaeton, cumbia, and more. Dance floor open.", tag: "Weekly" },
    { day: "Saturday", name: "Toxic Fridays", desc: "The main event. Top DJs, bottle service, full production.", tag: "Weekly" },
    { day: "Special", name: "Private Events", desc: "Birthdays, corporate buyouts, and exclusive experiences. Inquire within.", tag: "Book Now" },
  ];

  return (
    <section
      id="events"
      style={{
        background: "#000",
        padding: "7rem 0",
        position: "relative",
      }}
    >
      <div className="container">
        <Reveal>
          <SectionHeading
            label="Events"
            title="THE WEEKLY LINEUP"
            subtitle="From open decks to Latin nights to full production Saturday shows — there's always something electric happening at Blindside."
          />
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {events.map((event, i) => (
            <Reveal key={event.name} delay={i * 0.08}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2rem",
                  padding: "1.75rem 2rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(43,127,255,0.08)",
                  transition: "background 0.3s, border-color 0.3s",
                  flexWrap: "wrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(43,127,255,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,127,255,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,127,255,0.08)";
                }}
              >
                <div style={{ minWidth: "100px" }}>
                  <p style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    letterSpacing: "0.25em",
                    color: "#2B7FFF",
                    textShadow: "0 0 8px rgba(43,127,255,0.5)",
                    textTransform: "uppercase",
                  }}>{event.day}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    letterSpacing: "0.1em",
                    color: "#e8eaf0",
                    marginBottom: "0.3rem",
                  }}>{event.name}</h3>
                  <p style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.82rem",
                    color: "rgba(184,196,208,0.55)",
                  }}>{event.desc}</p>
                </div>
                <span style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  color: "#8B3FBF",
                  border: "1px solid rgba(139,63,191,0.4)",
                  padding: "4px 12px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  boxShadow: "0 0 8px rgba(139,63,191,0.2)",
                }}>{event.tag}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Instagram CTA */}
        <Reveal delay={0.3}>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <a
              href="https://www.instagram.com/blindsidelounge"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                color: "rgba(184,196,208,0.7)",
                border: "1px solid rgba(139,63,191,0.3)",
                padding: "12px 28px",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,63,191,0.7)";
                (e.currentTarget as HTMLElement).style.color = "#C040FF";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(139,63,191,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,63,191,0.3)";
                (e.currentTarget as HTMLElement).style.color = "rgba(184,196,208,0.7)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Follow @blindsidelounge for upcoming events
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   GALLERY SECTION
   ═══════════════════════════════════════════════════════════ */
function GallerySection() {
  const images = [
    { src: "/manus-storage/bararea_3eb3dc01.jpg", alt: "Bar area with neon lighting" },
    { src: "/manus-storage/lounge2_e14be62e.jpg", alt: "Lounge view from rear" },
    { src: "/manus-storage/bararea2_0b60c00e.jpg", alt: "Bar area side view" },
    { src: "/manus-storage/rearbar2_0c726d4f.jpg", alt: "Rear bar area" },
    { src: "/manus-storage/lounge3_41607289.jpg", alt: "Full lounge view" },
    { src: "/manus-storage/bararea3_4795420b.jpg", alt: "Bar area crowd" },
  ];

  return (
    <section
      id="gallery"
      style={{
        background: "#000",
        padding: "7rem 0",
        position: "relative",
      }}
    >
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(139,63,191,0.4), rgba(43,127,255,0.4), transparent)",
      }} />

      <div className="container">
        <Reveal>
          <SectionHeading
            label="Gallery"
            title="INSIDE BLINDSIDE"
            subtitle="Step inside Austin's most visually striking nightlife venue. Every corner tells a story."
          />
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "auto auto",
          gap: "3px",
        }}>
          {images.map((img, i) => (
            <Reveal key={img.src} delay={i * 0.07}>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  aspectRatio: i === 0 || i === 3 ? "1/1.2" : "1/1",
                  cursor: "pointer",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease, filter 0.4s ease",
                    filter: "brightness(0.85) saturate(1.1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)";
                    (e.currentTarget as HTMLImageElement).style.filter = "brightness(1) saturate(1.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLImageElement).style.filter = "brightness(0.85) saturate(1.1)";
                  }}
                />
                {/* Hover overlay */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(43,127,255,0.0)",
                  transition: "background 0.3s",
                  pointerEvents: "none",
                }} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <a
              href="https://www.instagram.com/blindsidelounge"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: "0.7rem",
                letterSpacing: "0.25em",
                color: "rgba(184,196,208,0.5)",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#2B7FFF"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(184,196,208,0.5)"; }}
            >
              View Full Gallery on Instagram →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESERVE SECTION
   ═══════════════════════════════════════════════════════════ */
function ReserveSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", partySize: "", occasion: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(43,127,255,0.2)",
    padding: "12px 16px",
    fontFamily: "'Raleway', sans-serif",
    fontSize: "0.88rem",
    color: "#e8eaf0",
    outline: "none",
    transition: "border-color 0.25s, box-shadow 0.25s",
    boxSizing: "border-box" as const,
    colorScheme: "dark" as const,
    backgroundColor: "rgba(255,255,255,0.04)",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const subject = encodeURIComponent(`VIP/Reservation Inquiry — ${form.name} | ${form.date}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nDate: ${form.date}\nParty Size: ${form.partySize}\nOccasion: ${form.occasion}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:blindsidetattoos@live.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section
      id="reserve"
      style={{
        position: "relative",
        padding: "7rem 0",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url(/manus-storage/bararea2_0b60c00e.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.25) saturate(0.8)",
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, rgba(43,127,255,0.08) 0%, rgba(0,0,0,0.5) 70%)",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <Reveal>
          <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
            <SectionHeading
              label="Reservations"
              title="SECURE YOUR NIGHT"
              subtitle="Reserve a table, inquire about bottle service, or plan a private event. We'll make sure your night is unforgettable."
            />

            {submitted ? (
              <div style={{
                background: "rgba(0,0,0,0.7)",
                border: "1px solid rgba(43,127,255,0.3)",
                padding: "3rem 2.5rem",
                backdropFilter: "blur(20px)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "#2B7FFF" }}>✦</div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontWeight: 300, fontSize: "1.2rem", letterSpacing: "0.2em", color: "#e8eaf0", marginBottom: "0.75rem" }}>REQUEST RECEIVED</h3>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, fontSize: "0.88rem", color: "rgba(184,196,208,0.6)", lineHeight: 1.8 }}>Your email client should have opened with your inquiry pre-filled. We’ll confirm your reservation within 24 hours.</p>
              </div>
            ) : (
            <form onSubmit={handleSubmit} style={{
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(43,127,255,0.2)",
              padding: "2.5rem",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(43,127,255,0.08)",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                <div style={{ textAlign: "left" }}>
                  <label style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 500, fontSize: "0.62rem", letterSpacing: "0.25em", color: "rgba(184,196,208,0.55)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Your Name</label>
                  <input required type="text" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "rgba(43,127,255,0.6)"; e.target.style.boxShadow = "0 0 12px rgba(43,127,255,0.15)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(43,127,255,0.2)"; e.target.style.boxShadow = "none"; }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ textAlign: "left" }}>
                    <label style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 500, fontSize: "0.62rem", letterSpacing: "0.25em", color: "rgba(184,196,208,0.55)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Phone</label>
                    <input required type="tel" placeholder="(512) 000-0000" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "rgba(43,127,255,0.6)"; e.target.style.boxShadow = "0 0 12px rgba(43,127,255,0.15)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(43,127,255,0.2)"; e.target.style.boxShadow = "none"; }} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <label style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 500, fontSize: "0.62rem", letterSpacing: "0.25em", color: "rgba(184,196,208,0.55)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Email</label>
                    <input required type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "rgba(43,127,255,0.6)"; e.target.style.boxShadow = "0 0 12px rgba(43,127,255,0.15)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(43,127,255,0.2)"; e.target.style.boxShadow = "none"; }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ textAlign: "left" }}>
                    <label style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 500, fontSize: "0.62rem", letterSpacing: "0.25em", color: "rgba(184,196,208,0.55)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Date</label>
                    <input required type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "rgba(43,127,255,0.6)"; e.target.style.boxShadow = "0 0 12px rgba(43,127,255,0.15)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(43,127,255,0.2)"; e.target.style.boxShadow = "none"; }} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <label style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 500, fontSize: "0.62rem", letterSpacing: "0.25em", color: "rgba(184,196,208,0.55)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Party Size</label>
                    <select value={form.partySize} onChange={e => setForm(f => ({...f, partySize: e.target.value}))} style={{...inputStyle, cursor: "pointer"}}>
                      <option value="" style={{ background: "#0a0a0f" }}>Select size</option>
                      {["1–2","3–5","6–10","11–20","20+"].map(s => <option key={s} value={s} style={{ background: "#0a0a0f" }}>{s} guests</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ textAlign: "left" }}>
                  <label style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 500, fontSize: "0.62rem", letterSpacing: "0.25em", color: "rgba(184,196,208,0.55)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Occasion</label>
                  <select value={form.occasion} onChange={e => setForm(f => ({...f, occasion: e.target.value}))} style={{...inputStyle, cursor: "pointer"}}>
                    <option value="" style={{ background: "#0a0a0f" }}>Select occasion</option>
                    {["Birthday","Bachelorette / Bachelor","Anniversary","Corporate Event","Private Buyout","Bottle Service","General Reservation","Other"].map(o => <option key={o} value={o} style={{ background: "#0a0a0f" }}>{o}</option>)}
                  </select>
                </div>

                <div style={{ textAlign: "left" }}>
                  <label style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 500, fontSize: "0.62rem", letterSpacing: "0.25em", color: "rgba(184,196,208,0.55)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Message / Special Requests</label>
                  <textarea
                    placeholder="Tell us about your event, VIP preferences, or bottle service inquiry..."
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(f => ({...f, message: e.target.value}))}
                    style={{ ...inputStyle, resize: "vertical" as const }}
                    onFocus={e => { e.target.style.borderColor = "rgba(43,127,255,0.6)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(43,127,255,0.2)"; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    width: "100%",
                    background: sending ? "rgba(43,127,255,0.4)" : "linear-gradient(135deg, #2B7FFF, #8B3FBF)",
                    border: "none",
                    padding: "16px",
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.25em",
                    color: "#fff",
                    textTransform: "uppercase",
                    cursor: sending ? "wait" : "pointer",
                    boxShadow: "0 0 20px rgba(43,127,255,0.4)",
                    transition: "box-shadow 0.25s, transform 0.15s",
                    marginTop: "0.5rem",
                  }}
                  onMouseEnter={e => { if (!sending) { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(43,127,255,0.7), 0 0 80px rgba(139,63,191,0.4)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(43,127,255,0.4)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  {sending ? "Opening Email..." : "Submit Reservation"}
                </button>
              </div>

              <div style={{
                marginTop: "1.75rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}>
                <a href="tel:5122361126" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "rgba(184,196,208,0.55)", textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#2B7FFF"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(184,196,208,0.55)"; }}
                >
                  📞 (512) 236-1126
                </a>
                <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "rgba(184,196,208,0.55)", letterSpacing: "0.05em" }}>
                  📍 211 E. 6th St, Austin TX
                </span>
              </div>
            </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
