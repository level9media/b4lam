/**
 * BLINDSIDE LOUNGE — ABOUT US PAGE
 * Design: Cyberpunk Signal — deep black, electric blue (#2B7FFF), ultraviolet (#8B3FBF)
 * Typography: Cinzel (weight 300) for headings, Raleway for body
 * Philosophy: Cinematic, immersive — like reading the origin story of a legend
 */

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapView } from "@/components/Map";

/* ── Reveal on scroll ─────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.8s cubic-bezier(0.23,1,0.32,1) ${delay}s, transform 0.8s cubic-bezier(0.23,1,0.32,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ── Neon divider ─────────────────────────────────────────────────── */
function NeonDivider() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "1rem",
      margin: "3rem 0",
    }}>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(43,127,255,0.3))" }} />
      <img src="/manus-storage/logo_11eca033.webp" alt="" style={{ height: "28px", opacity: 0.35, filter: "drop-shadow(0 0 6px rgba(43,127,255,0.5))" }} />
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(43,127,255,0.3))" }} />
    </div>
  );
}

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About | Blindside Lounge — Austin, TX";
  }, []);

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#e8eaf0" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Background — bar area photo */}
        <img
          src="/manus-storage/bararea_ee451366.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 40%",
            opacity: 0.3,
          }}
        />
        {/* Overlays */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.85) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(43,127,255,0.07) 0%, transparent 70%)",
        }} />
        {/* Scan lines */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(43,127,255,0.01) 2px, rgba(43,127,255,0.01) 4px)",
        }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "10rem 2rem 5rem" }}>
          <p style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "0.7rem", letterSpacing: "0.45em",
            color: "#2B7FFF", textShadow: "0 0 14px rgba(43,127,255,0.8)",
            textTransform: "uppercase", marginBottom: "1.25rem",
          }}>211 E. 6th Street · Austin, Texas</p>

          <h1 style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            lineHeight: 1.05,
            marginBottom: "1.5rem",
          }}>
            Our<br />
            <span style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(43,127,255,0.9)",
              textShadow: "0 0 50px rgba(43,127,255,0.35)",
            }}>Story</span>
          </h1>

          <p style={{
            fontFamily: "'Raleway', sans-serif", fontWeight: 300,
            fontSize: "1.05rem", color: "rgba(232,234,240,0.55)",
            maxWidth: "520px", margin: "0 auto",
            lineHeight: 1.8, letterSpacing: "0.03em",
          }}>
            Born on the most legendary block in Austin. Built for the culture that never sleeps.
          </p>
        </div>
      </section>

      {/* ── SIXTH STREET CONTEXT ─────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#000" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem" }}>
          <Reveal>
            <p style={{
              fontFamily: "'Cinzel', serif", fontWeight: 300,
              fontSize: "0.65rem", letterSpacing: "0.4em",
              color: "#2B7FFF", textShadow: "0 0 10px rgba(43,127,255,0.7)",
              textTransform: "uppercase", marginBottom: "1.25rem",
            }}>Historic Sixth Street</p>
            <h2 style={{
              fontFamily: "'Cinzel', serif", fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#e8eaf0", marginBottom: "2rem", lineHeight: 1.2,
            }}>
              The Most Electric<br />Block in Texas
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{
              fontFamily: "'Raleway', sans-serif", fontWeight: 300,
              fontSize: "1rem", color: "rgba(232,234,240,0.6)",
              lineHeight: 1.95, marginBottom: "1.5rem",
            }}>
              Sixth Street is more than an address — it is the beating heart of Austin's nightlife, music, and cultural identity. For decades, this historic corridor has been the proving ground for artists, the gathering place for communities, and the stage where Austin's legendary "Live Music Capital of the World" reputation was forged night after night.
            </p>
            <p style={{
              fontFamily: "'Raleway', sans-serif", fontWeight: 300,
              fontSize: "1rem", color: "rgba(232,234,240,0.6)",
              lineHeight: 1.95, marginBottom: "1.5rem",
            }}>
              East Sixth Street in particular has evolved into something distinct — a corridor where underground culture, diverse communities, and boundary-pushing creativity converge. It is here, at 211 E. 6th Street, that Blindside Lounge was born.
            </p>
          </Reveal>

          <NeonDivider />

          {/* Two-column image + text */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
            marginBottom: "4rem",
          }}
            className="about-two-col"
          >
            <Reveal delay={0.05}>
              <div style={{ position: "relative" }}>
                <img
                  src="/manus-storage/VIEWOFLOUNGE_58be8d57.jpg"
                  alt="Blindside Lounge interior"
                  style={{
                    width: "100%", height: "380px",
                    objectFit: "cover",
                    border: "1px solid rgba(43,127,255,0.15)",
                    boxShadow: "0 0 40px rgba(43,127,255,0.08)",
                  }}
                />
                {/* Neon corner accent */}
                <div style={{
                  position: "absolute", top: "-6px", left: "-6px",
                  width: "30px", height: "30px",
                  borderTop: "2px solid #2B7FFF",
                  borderLeft: "2px solid #2B7FFF",
                  boxShadow: "0 0 10px rgba(43,127,255,0.5)",
                }} />
                <div style={{
                  position: "absolute", bottom: "-6px", right: "-6px",
                  width: "30px", height: "30px",
                  borderBottom: "2px solid #8B3FBF",
                  borderRight: "2px solid #8B3FBF",
                  boxShadow: "0 0 10px rgba(139,63,191,0.5)",
                }} />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div>
                <p style={{
                  fontFamily: "'Cinzel', serif", fontWeight: 300,
                  fontSize: "0.65rem", letterSpacing: "0.4em",
                  color: "#8B3FBF", textShadow: "0 0 10px rgba(139,63,191,0.7)",
                  textTransform: "uppercase", marginBottom: "1rem",
                }}>The Origin</p>
                <h3 style={{
                  fontFamily: "'Cinzel', serif", fontWeight: 300,
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "#e8eaf0", marginBottom: "1.25rem", lineHeight: 1.3,
                }}>A Vision for Something Different</h3>
                <p style={{
                  fontFamily: "'Raleway', sans-serif", fontWeight: 300,
                  fontSize: "0.95rem", color: "rgba(232,234,240,0.6)",
                  lineHeight: 1.9, marginBottom: "1rem",
                }}>
                  Blindside Lounge was created with a singular vision: to build an immersive nightlife experience that Austin had never seen before. Not just another bar. Not just another club. A destination — a neon-lit sanctuary where music, art, culture, and community collide.
                </p>
                <p style={{
                  fontFamily: "'Raleway', sans-serif", fontWeight: 300,
                  fontSize: "0.95rem", color: "rgba(232,234,240,0.6)",
                  lineHeight: 1.9,
                }}>
                  The name says it all. We came out of nowhere. We hit different. We hit hard.
                </p>
              </div>
            </Reveal>
          </div>

          <style>{`
            @media (max-width: 700px) {
              .about-two-col { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ── WHAT WE ARE ──────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(180deg, #000 0%, #04040f 50%, #000 100%)",
        padding: "5rem 0 6rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background sigil watermark */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "600px",
          opacity: 0.025,
          backgroundImage: "url(/manus-storage/logo_11eca033.webp)",
          backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 1 }}>
          <Reveal>
            <p style={{
              fontFamily: "'Cinzel', serif", fontWeight: 300,
              fontSize: "0.65rem", letterSpacing: "0.4em",
              color: "#2B7FFF", textShadow: "0 0 10px rgba(43,127,255,0.7)",
              textTransform: "uppercase", marginBottom: "1.25rem",
            }}>What We Are</p>
            <h2 style={{
              fontFamily: "'Cinzel', serif", fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#e8eaf0", marginBottom: "2.5rem", lineHeight: 1.2,
            }}>
              More Than a Bar.<br />
              <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(43,127,255,0.8)" }}>
                A Cultural Landmark.
              </span>
            </h2>
          </Reveal>

          {/* Pillars grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "rgba(43,127,255,0.08)",
            marginBottom: "4rem",
          }}
            className="about-pillars"
          >
            {[
              {
                icon: "♪",
                title: "Live Music & DJs",
                body: "From hip-hop to EDM, Latin to experimental — Blindside's stage has hosted Austin's most exciting emerging artists and resident DJs. Every night is a different frequency.",
              },
              {
                icon: "◈",
                title: "Craft Cocktails",
                body: "Our bar program draws inspiration from Mesoamerican culture and modern mixology. Each cocktail is a ritual — handcrafted, intentional, and worth savoring.",
              },
              {
                icon: "◉",
                title: "Artist Discovery",
                body: "We believe in the next wave. Blindside is a launchpad for Austin's underground talent — a place where the next breakout artist gets their first real stage.",
              },
              {
                icon: "⬡",
                title: "Private & Corporate Events",
                body: "From intimate birthday celebrations to full venue buyouts for corporate clients, we transform Blindside into your exclusive event space with premium hospitality.",
              },
              {
                icon: "✦",
                title: "Immersive Atmosphere",
                body: "LED walls, neon lighting, architectural detail, and a layout designed for energy flow. Blindside is a sensory experience from the moment you walk in.",
              },
              {
                icon: "⊕",
                title: "Community & Culture",
                body: "We are rooted in Austin's diverse, creative community. Blindside is a space where all cultures, genres, and identities are welcome — and celebrated.",
              },
            ].map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.08}>
                <div style={{
                  background: "#06060e",
                  padding: "2.25rem 1.75rem",
                  height: "100%", boxSizing: "border-box",
                  transition: "background 0.3s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(43,127,255,0.04)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#06060e"}
                >
                  <div style={{
                    fontSize: "1.4rem",
                    color: "#2B7FFF",
                    textShadow: "0 0 12px rgba(43,127,255,0.7)",
                    marginBottom: "1rem",
                    lineHeight: 1,
                  }}>{pillar.icon}</div>
                  <h4 style={{
                    fontFamily: "'Cinzel', serif", fontWeight: 400,
                    fontSize: "0.75rem", letterSpacing: "0.2em",
                    color: "#e8eaf0", textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}>{pillar.title}</h4>
                  <p style={{
                    fontFamily: "'Raleway', sans-serif", fontWeight: 300,
                    fontSize: "0.82rem", color: "rgba(184,196,208,0.55)",
                    lineHeight: 1.85,
                  }}>{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <style>{`
            @media (max-width: 700px) {
              .about-pillars { grid-template-columns: 1fr !important; }
            }
            @media (min-width: 701px) and (max-width: 1000px) {
              .about-pillars { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ── FULL-WIDTH VENUE PHOTO ────────────────────────────── */}
      <section style={{ position: "relative", height: "clamp(280px, 40vw, 480px)", overflow: "hidden" }}>
        <img
          src="/manus-storage/coolbarimage_34ba51f4.jpg"
          alt="Blindside Lounge bar area"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "brightness(0.55)" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.7) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: "0.75rem",
        }}>
          <p style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "clamp(0.9rem, 2.5vw, 1.4rem)",
            letterSpacing: "0.5em", textTransform: "uppercase",
            color: "rgba(232,234,240,0.85)",
            textShadow: "0 0 30px rgba(43,127,255,0.5)",
          }}>UPSCALE UNDERGROUND NIGHTLIFE</p>
          <div style={{
            width: "80px", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(43,127,255,0.7), transparent)",
            boxShadow: "0 0 8px rgba(43,127,255,0.4)",
          }} />
          <p style={{
            fontFamily: "'Raleway', sans-serif", fontWeight: 300,
            fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "rgba(232,234,240,0.4)",
          }}>211 E. 6th Street · Austin, Texas</p>
        </div>
      </section>

      {/* ── THE SIGIL ────────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#000" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
          <Reveal>
            <img
              src="/manus-storage/logo_11eca033.webp"
              alt="Blindside Lounge Sigil"
              style={{
                height: "120px", width: "auto",
                margin: "0 auto 2.5rem",
                display: "block",
                filter: "drop-shadow(0 0 20px rgba(43,127,255,0.5)) drop-shadow(0 0 40px rgba(139,63,191,0.3))",
              }}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{
              fontFamily: "'Cinzel', serif", fontWeight: 300,
              fontSize: "0.65rem", letterSpacing: "0.4em",
              color: "#2B7FFF", textShadow: "0 0 10px rgba(43,127,255,0.7)",
              textTransform: "uppercase", marginBottom: "1.25rem",
            }}>The Blindside Sigil</p>
            <h2 style={{
              fontFamily: "'Cinzel', serif", fontWeight: 300,
              fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#e8eaf0", marginBottom: "1.75rem", lineHeight: 1.2,
            }}>A Symbol of the Culture</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{
              fontFamily: "'Raleway', sans-serif", fontWeight: 300,
              fontSize: "1rem", color: "rgba(232,234,240,0.55)",
              lineHeight: 1.95, marginBottom: "1.25rem",
            }}>
              The Blindside cross — our sigil — is more than a logo. It is the unifying mark of the entire Blindside brand family. Rooted in ritualistic iconography and modernized with neon energy, the sigil appears across every touchpoint: signage, menus, merchandise, LED walls, and social media.
            </p>
            <p style={{
              fontFamily: "'Raleway', sans-serif", fontWeight: 300,
              fontSize: "1rem", color: "rgba(232,234,240,0.55)",
              lineHeight: 1.95,
            }}>
              It represents the intersection of cultures, the convergence of art forms, and the moment when everything comes together on a perfect night out. When you see the sigil, you know you're in the right place.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(180deg, #000 0%, #04040f 50%, #000 100%)",
        padding: "5rem 2rem 7rem",
        textAlign: "center",
        borderTop: "1px solid rgba(43,127,255,0.08)",
      }}>
        <Reveal>
          <p style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "0.7rem", letterSpacing: "0.4em",
            color: "#2B7FFF", textShadow: "0 0 12px rgba(43,127,255,0.7)",
            textTransform: "uppercase", marginBottom: "1.25rem",
          }}>Come Experience It</p>
          <h2 style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            letterSpacing: "0.12em", color: "#e8eaf0",
            textTransform: "uppercase", marginBottom: "1.5rem",
          }}>Your Night Starts Here.</h2>
          <p style={{
            fontFamily: "'Raleway', sans-serif", fontWeight: 300,
            fontSize: "0.95rem", color: "rgba(232,234,240,0.5)",
            maxWidth: "440px", margin: "0 auto 2.5rem", lineHeight: 1.8,
          }}>
            Reserve your table, book bottle service, or just show up. Blindside is open Thursday through Saturday on Historic Sixth Street in Austin, Texas.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/#reserve" style={{
              fontFamily: "'Cinzel', serif", fontWeight: 300,
              fontSize: "0.75rem", letterSpacing: "0.2em",
              textTransform: "uppercase", padding: "0.9rem 2.2rem",
              background: "linear-gradient(135deg, #2B7FFF 0%, #8B3FBF 100%)",
              color: "#e8eaf0", textDecoration: "none",
              boxShadow: "0 0 30px rgba(43,127,255,0.3)",
              transition: "box-shadow 0.25s", display: "inline-block",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 50px rgba(43,127,255,0.5)"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(43,127,255,0.3)"}
            >Reserve a Table</a>
            <a href="/experience" style={{
              fontFamily: "'Cinzel', serif", fontWeight: 300,
              fontSize: "0.75rem", letterSpacing: "0.2em",
              textTransform: "uppercase", padding: "0.9rem 2.2rem",
              border: "1px solid rgba(43,127,255,0.4)",
              color: "#e8eaf0", textDecoration: "none",
              transition: "all 0.25s", display: "inline-block",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(43,127,255,0.8)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(43,127,255,0.2)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(43,127,255,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              }}
            >View the Gallery</a>
          </div>
        </Reveal>
      </section>

      {/* ── FIND US MAP ──────────────────────────────────────── */}
      <section style={{ background: "#000", padding: "0 0 6rem" }}>
        <div className="container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <p style={{
                fontFamily: "'Cinzel', serif", fontWeight: 300,
                fontSize: "0.6rem", letterSpacing: "0.45em",
                color: "#2B7FFF", textShadow: "0 0 12px rgba(43,127,255,0.7)",
                textTransform: "uppercase", marginBottom: "0.6rem",
              }}>Historic Sixth Street · Austin, Texas</p>
              <h2 style={{
                fontFamily: "'Cinzel', serif", fontWeight: 300,
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                letterSpacing: "0.15em", color: "#e8eaf0",
                textTransform: "uppercase", marginBottom: "0.5rem",
              }}>Find Us</h2>
              <p style={{
                fontFamily: "'Raleway', sans-serif", fontWeight: 300,
                fontSize: "0.88rem", color: "rgba(184,196,208,0.5)",
                letterSpacing: "0.05em",
              }}>211 E. 6th Street, Austin, TX 78701</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{
              position: "relative",
              border: "1px solid rgba(43,127,255,0.2)",
              overflow: "hidden",
            }}>
              {/* Corner accents */}
              <div style={{ position: "absolute", top: 0, left: 0, width: 24, height: 24, borderTop: "1px solid #2B7FFF", borderLeft: "1px solid #2B7FFF", zIndex: 2 }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderBottom: "1px solid #8B3FBF", borderRight: "1px solid #8B3FBF", zIndex: 2 }} />
              {/* Top neon glow line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #2B7FFF, #8B3FBF, transparent)", zIndex: 2 }} />

              <div style={{ height: "420px" }}>
              <MapView
                className="w-full h-full"
                initialCenter={{ lat: 30.2672, lng: -97.7431 }}
                initialZoom={16}
                onMapReady={(map) => {
                  // Drop a custom neon-styled marker on Blindside Lounge
                  const geocoder = new window.google.maps.Geocoder();
                  geocoder.geocode(
                    { address: "211 E 6th Street, Austin, TX 78701" },
                    (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                      if (status === "OK" && results && results[0]) {
                        const pos = results[0].geometry.location;
                        map.setCenter(pos);
                        new window.google.maps.marker.AdvancedMarkerElement({
                          map,
                          position: pos,
                          title: "Blindside Lounge — 211 E. 6th Street, Austin, TX",
                        });
                      }
                    }
                  );
                  // Apply dark neon map style
                  map.setOptions({
                    styles: [
                      { elementType: "geometry", stylers: [{ color: "#0a0a14" }] },
                      { elementType: "labels.text.stroke", stylers: [{ color: "#000" }] },
                      { elementType: "labels.text.fill", stylers: [{ color: "#6b7a99" }] },
                      { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
                      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2B7FFF", lightness: -60 }] },
                      { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1e2a4a" }] },
                      { featureType: "water", elementType: "geometry", stylers: [{ color: "#060614" }] },
                      { featureType: "poi", elementType: "geometry", stylers: [{ color: "#0d0d1a" }] },
                      { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#4a5568" }] },
                      { featureType: "transit", elementType: "geometry", stylers: [{ color: "#0d0d1a" }] },
                      { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#2B7FFF", lightness: -70 }] },
                    ],
                  });
                }}
              />
              </div>
            </div>
          </Reveal>

          {/* Address + hours row */}
          <Reveal delay={0.15}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1px",
              background: "rgba(43,127,255,0.08)",
              marginTop: "1px",
            }}>
              {[
                { label: "Address", value: "211 E. 6th Street\nAustin, TX 78701" },
                { label: "Thursday", value: "8 PM – 2 AM" },
                { label: "Friday – Saturday", value: "9 PM – 3 AM" },
                { label: "Sunday", value: "8 PM – 12 AM" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: "#06060e",
                  padding: "1.5rem 1.75rem",
                  textAlign: "center",
                }}>
                  <p style={{
                    fontFamily: "'Cinzel', serif", fontWeight: 300,
                    fontSize: "0.52rem", letterSpacing: "0.35em",
                    color: "#2B7FFF", textShadow: "0 0 8px rgba(43,127,255,0.5)",
                    textTransform: "uppercase", marginBottom: "0.5rem",
                  }}>{label}</p>
                  <p style={{
                    fontFamily: "'Raleway', sans-serif", fontWeight: 300,
                    fontSize: "0.88rem", color: "rgba(184,196,208,0.7)",
                    whiteSpace: "pre-line", lineHeight: 1.6,
                  }}>{value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
