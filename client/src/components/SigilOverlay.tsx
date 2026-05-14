/**
 * BLINDSIDE LOUNGE — Sigil Overlay
 * Full-screen cinematic page transition using the Blindside neon sigil.
 * Plays on every page navigation: black sweeps in → sigil animates → black recedes.
 *
 * Design: Deep black, electric blue glow, violet pulse, chrome metallic sigil
 */

import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/contexts/PageTransitionContext";

export default function SigilOverlay() {
  const { transitionState } = usePageTransition();
  const visible = transitionState !== "idle";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sigil-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#06060e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            pointerEvents: "all",
          }}
        >
          {/* Ambient radial glow behind sigil */}
          <div
            style={{
              position: "absolute",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(43,127,255,0.12) 0%, rgba(139,63,191,0.08) 40%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Rotating outer ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
            animate={
              transitionState === "entering"
                ? { opacity: 0.35, scale: 1.1, rotate: 0 }
                : transitionState === "holding"
                ? { opacity: 0.35, scale: 1.1, rotate: 15 }
                : { opacity: 0, scale: 1.4, rotate: 45 }
            }
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: "absolute",
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              border: "1px solid rgba(43,127,255,0.3)",
              boxShadow:
                "0 0 40px rgba(43,127,255,0.15), inset 0 0 40px rgba(43,127,255,0.05)",
            }}
          />

          {/* Inner ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
            animate={
              transitionState === "entering"
                ? { opacity: 0.5, scale: 1, rotate: 0 }
                : transitionState === "holding"
                ? { opacity: 0.5, scale: 1, rotate: -20 }
                : { opacity: 0, scale: 1.3, rotate: -50 }
            }
            transition={{ duration: 0.55, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: "absolute",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              border: "1px solid rgba(139,63,191,0.4)",
              boxShadow:
                "0 0 30px rgba(139,63,191,0.2), inset 0 0 30px rgba(139,63,191,0.08)",
            }}
          />

          {/* The sigil image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.55, filter: "brightness(0) blur(8px)" }}
            animate={
              transitionState === "entering"
                ? {
                    opacity: 1,
                    scale: 1,
                    filter: "brightness(1.2) blur(0px) drop-shadow(0 0 20px rgba(43,127,255,0.8)) drop-shadow(0 0 40px rgba(139,63,191,0.5))",
                  }
                : transitionState === "holding"
                ? {
                    opacity: 1,
                    scale: 1.02,
                    filter: "brightness(1.3) blur(0px) drop-shadow(0 0 30px rgba(43,127,255,1)) drop-shadow(0 0 60px rgba(139,63,191,0.7))",
                  }
                : {
                    opacity: 0,
                    scale: 1.2,
                    filter: "brightness(2) blur(6px) drop-shadow(0 0 60px rgba(43,127,255,1))",
                  }
            }
            transition={{
              duration: transitionState === "leaving" ? 0.5 : 0.6,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <img
              src="/manus-storage/logo_11eca033.webp"
              alt="Blindside Sigil"
              style={{
                width: "160px",
                height: "160px",
                objectFit: "contain",
              }}
            />
          </motion.div>

          {/* Scan line overlay for texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(43,127,255,0.015) 3px,
                rgba(43,127,255,0.015) 6px
              )`,
              pointerEvents: "none",
            }}
          />

          {/* Wordmark below sigil */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={
              transitionState === "entering"
                ? { opacity: 1, y: 0 }
                : transitionState === "holding"
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: -8 }
            }
            transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: "absolute",
              bottom: "calc(50% - 130px)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 300,
                fontSize: "0.75rem",
                letterSpacing: "0.55em",
                color: "rgba(184,196,208,0.5)",
                textTransform: "uppercase",
              }}
            >
              BLINDSIDE &nbsp;·&nbsp; LOUNGE
            </div>
          </motion.div>

          {/* Corner accent lines */}
          {[
            { top: "10%", left: "10%", rotate: 0 },
            { top: "10%", right: "10%", rotate: 90 },
            { bottom: "10%", left: "10%", rotate: 270 },
            { bottom: "10%", right: "10%", rotate: 180 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                transitionState === "entering"
                  ? { opacity: 0.25, scale: 1 }
                  : transitionState === "holding"
                  ? { opacity: 0.25, scale: 1 }
                  : { opacity: 0, scale: 0.5 }
              }
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: "absolute",
                ...pos,
                width: "40px",
                height: "40px",
                borderTop: "1px solid rgba(43,127,255,0.5)",
                borderLeft: "1px solid rgba(43,127,255,0.5)",
                transform: `rotate(${pos.rotate}deg)`,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
