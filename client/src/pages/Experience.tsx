/**
 * BLINDSIDE LOUNGE — THE BLINDSIDE EXPERIENCE (Gallery Page)
 * Design: Cyberpunk Signal — deep black, electric blue (#2B7FFF), ultraviolet (#8B3FBF)
 * Typography: Cinzel (weight 300) for headings
 * Layout: Masonry-style CSS columns grid with lightbox popup on click
 * All 27 images from the Blindside community / event photography
 */

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Gallery image data ───────────────────────────────────────────── */
const GALLERY_IMAGES = [
  { src: "/manus-storage/stasiareign_1742419653_3591998854668913865_1926403128_a0630c63.jpg", alt: "Blindside Lounge — Live Performance" },
  { src: "/manus-storage/bigxodia_1742353296_3591442213780197590_4497789447_0ca47035.webp", alt: "Blindside Lounge — Artist Night" },
  { src: "/manus-storage/4000_cj_1742237135_3590467782263184698_1939565941_f2bdb0a4.jpg", alt: "Blindside Lounge — Live Show" },
  { src: "/manus-storage/i_am_mdx_1738539524_3559449976468692956_61634806768(1)_a9f721f0.jpg", alt: "Blindside Lounge — MDX Night" },
  { src: "/manus-storage/i_am_mdx_1738539524_3559449976552782037_61634806768(1)_a7b438f9.jpg", alt: "Blindside Lounge — MDX Night" },
  { src: "/manus-storage/i_am_mdx_1738539524_3559449976359724150_61634806768(1)_1c317a8c.jpg", alt: "Blindside Lounge — MDX Night" },
  { src: "/manus-storage/liln8o_1756092768_3706697257913572602_62467239162_85148222.jpg", alt: "Blindside Lounge — Lil N8O" },
  { src: "/manus-storage/i_am_mdx_1738539524_3559449976376502038_61634806768(1)_bb0e7ee8.jpg", alt: "Blindside Lounge — MDX Night" },
  { src: "/manus-storage/paradox_wifey_1716227142_3372280146188153283_3613150086_649431a2.jpg", alt: "Blindside Lounge — Paradox Night" },
  { src: "/manus-storage/paradox_wifey_1716227142_3372280146179851030_3613150086_21e46389.jpg", alt: "Blindside Lounge — Paradox Night" },
  { src: "/manus-storage/paradox_wifey_1716227142_3372280146246824188_3613150086_869171e7.jpg", alt: "Blindside Lounge — Paradox Night" },
  { src: "/manus-storage/paradox_wifey_1716227142_3372280146188071476_3613150086_c262410b.jpg", alt: "Blindside Lounge — Paradox Night" },
  { src: "/manus-storage/paradox_wifey_1716227142_3372280146188081447_3613150086_f378cbe6.jpg", alt: "Blindside Lounge — Paradox Night" },
  { src: "/manus-storage/darkaospixy_1748505984_3643054698589291350_60518413098_f5870fe3.jpg", alt: "Blindside Lounge — Dark AO Spixy" },
  { src: "/manus-storage/paradox_wifey_1716227142_3372280146196615654_3613150086_51670667.jpg", alt: "Blindside Lounge — Paradox Night" },
  { src: "/manus-storage/darkaospixy_1748506122_3643055855025981025_60518413098_d6eb05f4.webp", alt: "Blindside Lounge — Dark AO Spixy" },
  { src: "/manus-storage/paradox_wifey_1716227142_3372280146255284090_3613150086_c30e5621.jpg", alt: "Blindside Lounge — Paradox Night" },
  { src: "/manus-storage/lostnfound.music_1709253048_3313777209486288380_10698513429_ca70fd8e.jpg", alt: "Blindside Lounge — Lost N Found" },
  { src: "/manus-storage/bigchieflew_1710186838_3321593717070402448_35096739_bfcde8b7.jpg", alt: "Blindside Lounge — Big Chief Lew" },
  { src: "/manus-storage/lostnfound.music_1709253048_3313777209452684655_10698513429_0f1d1ff1.jpg", alt: "Blindside Lounge — Lost N Found" },
  { src: "/manus-storage/lostnfound.music_1709253048_3313777209486344014_10698513429_95fc7004.jpg", alt: "Blindside Lounge — Lost N Found" },
  { src: "/manus-storage/lostnfound.music_1709253048_3313777209662493075_10698513429_ae4879ea.jpg", alt: "Blindside Lounge — Lost N Found" },
  { src: "/manus-storage/lostnfound.music_1709253048_3313777209477920538_10698513429_973bea04.jpg", alt: "Blindside Lounge — Lost N Found" },
  { src: "/manus-storage/kimberbatch_osp_1708889450_3310727129653296538_1409975593_f2b6995a.webp", alt: "Blindside Lounge — Kimberbatch OSP" },
  { src: "/manus-storage/kimberbatch_osp_1708889450_3310727129669892122_1409975593_d4a9637f.webp", alt: "Blindside Lounge — Kimberbatch OSP" },
  { src: "/manus-storage/kimberbatch_osp_1708889450_3310727129703597152_1409975593_ac271c14.webp", alt: "Blindside Lounge — Kimberbatch OSP" },
  { src: "/manus-storage/darkaospixy_1746826585_3628966880850975661_60518413098_d260ea27.jpg", alt: "Blindside Lounge — Dark AO Spixy" },
];

/* ── Lightbox component ───────────────────────────────────────────── */
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: typeof GALLERY_IMAGES;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const img = images[index];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      {/* Neon corner accents */}
      {[
        { top: 0, left: 0, borderTop: "1px solid rgba(43,127,255,0.4)", borderLeft: "1px solid rgba(43,127,255,0.4)" },
        { top: 0, right: 0, borderTop: "1px solid rgba(43,127,255,0.4)", borderRight: "1px solid rgba(43,127,255,0.4)" },
        { bottom: 0, left: 0, borderBottom: "1px solid rgba(43,127,255,0.4)", borderLeft: "1px solid rgba(43,127,255,0.4)" },
        { bottom: 0, right: 0, borderBottom: "1px solid rgba(43,127,255,0.4)", borderRight: "1px solid rgba(43,127,255,0.4)" },
      ].map((style, i) => (
        <div key={i} style={{ position: "absolute", width: "40px", height: "40px", ...style, pointerEvents: "none" }} />
      ))}

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "1.5rem", right: "1.5rem",
          background: "none", border: "1px solid rgba(43,127,255,0.3)",
          color: "rgba(232,234,240,0.7)", fontSize: "1rem",
          width: "40px", height: "40px",
          cursor: "pointer", zIndex: 10,
          fontFamily: "'Cinzel', serif",
          transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(43,127,255,0.8)";
          (e.currentTarget as HTMLButtonElement).style.color = "#2B7FFF";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 15px rgba(43,127,255,0.3)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(43,127,255,0.3)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,234,240,0.7)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
      >✕</button>

      {/* Prev button */}
      <button
        onClick={e => { e.stopPropagation(); onPrev(); }}
        style={{
          position: "absolute", left: "1.5rem", top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.6)", border: "1px solid rgba(43,127,255,0.3)",
          color: "rgba(232,234,240,0.7)", fontSize: "1.2rem",
          width: "48px", height: "48px",
          cursor: "pointer", zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(43,127,255,0.8)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(43,127,255,0.3)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(43,127,255,0.3)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
      >‹</button>

      {/* Next button */}
      <button
        onClick={e => { e.stopPropagation(); onNext(); }}
        style={{
          position: "absolute", right: "1.5rem", top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.6)", border: "1px solid rgba(43,127,255,0.3)",
          color: "rgba(232,234,240,0.7)", fontSize: "1.2rem",
          width: "48px", height: "48px",
          cursor: "pointer", zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(43,127,255,0.8)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(43,127,255,0.3)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(43,127,255,0.3)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
      >›</button>

      {/* Image */}
      <div
        style={{ maxWidth: "90vw", maxHeight: "85vh", position: "relative" }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.alt}
          style={{
            maxWidth: "90vw",
            maxHeight: "85vh",
            objectFit: "contain",
            display: "block",
            boxShadow: "0 0 60px rgba(43,127,255,0.15), 0 0 120px rgba(43,127,255,0.08)",
            border: "1px solid rgba(43,127,255,0.15)",
          }}
        />
        {/* Caption */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0.75rem 1rem",
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        }}>
          <p style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "0.65rem", letterSpacing: "0.2em",
            color: "rgba(232,234,240,0.6)", textTransform: "uppercase",
          }}>{img.alt}</p>
          <p style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "0.65rem", letterSpacing: "0.15em",
            color: "rgba(43,127,255,0.7)",
          }}>{index + 1} / {images.length}</p>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{
        position: "absolute", bottom: "1.5rem", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: "6px",
      }}>
        {images.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? "20px" : "6px",
              height: "2px",
              background: i === index ? "#2B7FFF" : "rgba(43,127,255,0.3)",
              boxShadow: i === index ? "0 0 8px rgba(43,127,255,0.6)" : "none",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────── */
export default function Experience() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "The Blindside Experience | Blindside Lounge — Austin, TX";
  }, []);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null), []);
  const nextImage = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % GALLERY_IMAGES.length : null), []);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero header ─────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        paddingTop: "10rem",
        paddingBottom: "4rem",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Radial glow */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "600px", height: "300px",
          background: "radial-gradient(ellipse, rgba(43,127,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Scan lines */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(43,127,255,0.012) 2px, rgba(43,127,255,0.012) 4px)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "0.7rem", letterSpacing: "0.4em",
            color: "#2B7FFF",
            textShadow: "0 0 12px rgba(43,127,255,0.8)",
            textTransform: "uppercase", marginBottom: "1.25rem",
          }}>Blindside Lounge · Austin, TX</p>

          <h1 style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "clamp(2.2rem, 6vw, 5rem)",
            letterSpacing: "0.12em",
            color: "#e8eaf0",
            textTransform: "uppercase",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}>
            The Blindside<br />
            <span style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(43,127,255,0.85)",
              textShadow: "0 0 40px rgba(43,127,255,0.4)",
            }}>Experience</span>
          </h1>

          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
            fontSize: "1rem",
            color: "rgba(232,234,240,0.5)",
            letterSpacing: "0.05em",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Nights that don't end. Energy that doesn't stop. Austin's most immersive underground lounge — captured live.
          </p>

          {/* Decorative line */}
          <div style={{
            width: "60px", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(43,127,255,0.6), transparent)",
            margin: "2rem auto 0",
            boxShadow: "0 0 8px rgba(43,127,255,0.4)",
          }} />
        </div>
      </section>

      {/* ── Gallery grid ────────────────────────────────────────── */}
      <section style={{ padding: "2rem 1.5rem 6rem", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Count label */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "1px solid rgba(43,127,255,0.1)",
          paddingBottom: "1rem",
        }}>
          <p style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "0.65rem", letterSpacing: "0.3em",
            color: "rgba(43,127,255,0.6)", textTransform: "uppercase",
          }}>
            {GALLERY_IMAGES.length} Photos
          </p>
          <p style={{
            fontFamily: "'Cinzel', serif", fontWeight: 300,
            fontSize: "0.65rem", letterSpacing: "0.2em",
            color: "rgba(232,234,240,0.3)", textTransform: "uppercase",
          }}>
            Click any image to expand
          </p>
        </div>

        {/* Masonry-style CSS columns */}
        <div style={{
          columnCount: 3,
          columnGap: "12px",
          // Responsive via media queries handled inline below
        }}
          className="gallery-masonry"
        >
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              onClick={() => openLightbox(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                breakInside: "avoid",
                marginBottom: "12px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                display: "block",
                border: hoveredIndex === i
                  ? "1px solid rgba(43,127,255,0.5)"
                  : "1px solid rgba(43,127,255,0.08)",
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxShadow: hoveredIndex === i
                  ? "0 0 30px rgba(43,127,255,0.2)"
                  : "none",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  transform: hoveredIndex === i ? "scale(1.04)" : "scale(1)",
                  transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1)",
                  filter: hoveredIndex === i ? "brightness(1.1)" : "brightness(0.85)",
                }}
              />
              {/* Hover overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: hoveredIndex === i
                  ? "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)"
                  : "transparent",
                transition: "background 0.3s",
                display: "flex", alignItems: "flex-end",
                padding: "1rem",
              }}>
                {hoveredIndex === i && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "6px",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B7FFF" strokeWidth="1.5">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    <span style={{
                      fontFamily: "'Cinzel', serif", fontWeight: 300,
                      fontSize: "0.6rem", letterSpacing: "0.2em",
                      color: "rgba(232,234,240,0.7)", textTransform: "uppercase",
                    }}>View</span>
                  </div>
                )}
              </div>

              {/* Neon corner accent on hover */}
              {hoveredIndex === i && (
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: "20px", height: "2px",
                  background: "#2B7FFF",
                  boxShadow: "0 0 8px rgba(43,127,255,0.8)",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Responsive column count via style tag */}
        <style>{`
          .gallery-masonry {
            column-count: 3;
          }
          @media (max-width: 900px) {
            .gallery-masonry { column-count: 2; }
          }
          @media (max-width: 540px) {
            .gallery-masonry { column-count: 1; }
          }
        `}</style>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(180deg, #000 0%, rgba(8,8,20,1) 50%, #000 100%)",
        padding: "4rem 2rem 6rem",
        textAlign: "center",
        borderTop: "1px solid rgba(43,127,255,0.08)",
      }}>
        <p style={{
          fontFamily: "'Cinzel', serif", fontWeight: 300,
          fontSize: "0.7rem", letterSpacing: "0.4em",
          color: "#2B7FFF", textShadow: "0 0 12px rgba(43,127,255,0.7)",
          textTransform: "uppercase", marginBottom: "1.25rem",
        }}>Be Part of the Story</p>
        <h2 style={{
          fontFamily: "'Cinzel', serif", fontWeight: 300,
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          letterSpacing: "0.12em", color: "#e8eaf0",
          textTransform: "uppercase", marginBottom: "1.5rem",
        }}>Your Night Awaits.</h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          fontSize: "0.95rem", color: "rgba(232,234,240,0.5)",
          maxWidth: "420px", margin: "0 auto 2.5rem", lineHeight: 1.7,
        }}>
          Reserve your table, book bottle service, or apply to perform. Blindside is where Austin comes alive.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/#reserve"
            style={{
              fontFamily: "'Cinzel', serif", fontWeight: 300,
              fontSize: "0.75rem", letterSpacing: "0.2em",
              textTransform: "uppercase", padding: "0.9rem 2.2rem",
              background: "linear-gradient(135deg, #2B7FFF 0%, #8B3FBF 100%)",
              border: "none", color: "#e8eaf0", cursor: "pointer",
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(43,127,255,0.3)",
              transition: "box-shadow 0.25s",
              display: "inline-block",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 50px rgba(43,127,255,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 30px rgba(43,127,255,0.3)")}
          >
            Reserve a Table
          </a>
          <a
            href="/artists"
            style={{
              fontFamily: "'Cinzel', serif", fontWeight: 300,
              fontSize: "0.75rem", letterSpacing: "0.2em",
              textTransform: "uppercase", padding: "0.9rem 2.2rem",
              border: "1px solid rgba(43,127,255,0.4)",
              background: "transparent", color: "#e8eaf0",
              textDecoration: "none", display: "inline-block",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(43,127,255,0.8)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(43,127,255,0.2)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(43,127,255,0.4)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            Apply to Perform
          </a>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={GALLERY_IMAGES}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
}
