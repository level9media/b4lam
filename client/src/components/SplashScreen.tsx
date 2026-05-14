/**
 * BLINDSIDE LOUNGE — SplashScreen Component
 * Design: Dark luxury nightlife — black canvas, neon glow logo
 * Behavior:
 *   - Full viewport black screen with logo centered
 *   - Hover: venue image fades in at 60% opacity behind logo
 *   - Click: cinematic wipe-up transition to main site
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onEnter: () => void;
}

const HOVER_IMAGE = "/manus-storage/lounge1_1f5300c2.jpg";

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    hintTimer.current = setTimeout(() => setShowHint(true), 2800);
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  const handleClick = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 900);
  };

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
          style={{ backgroundColor: "#000000" }}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] },
          }}
        >
          {/* Background venue image — revealed on hover */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${HOVER_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.6 : 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          {/* Dark overlay — always present, dims on hover */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.97) 100%)",
            }}
            animate={{ opacity: isHovered ? 0.7 : 1 }}
            transition={{ duration: 0.7 }}
          />

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
            }}
          />

          {/* Ambient neon glow orbs */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(43,127,255,0.08) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139,63,191,0.07) 0%, transparent 70%)",
              top: "40%",
              left: "55%",
              transform: "translate(-50%, -50%)",
              filter: "blur(60px)",
            }}
          />

          {/* Center content */}
          <div className="relative z-20 flex flex-col items-center select-none">
            {/* Logo icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
              style={{
                filter:
                  "drop-shadow(0 0 12px rgba(43,127,255,0.7)) drop-shadow(0 0 35px rgba(139,63,191,0.5))",
                animation: "glow-breathe 3s ease-in-out infinite",
              }}
            >
              <img
                src="/manus-storage/logo_11eca033.webp"
                alt="Blindside Lounge"
                style={{
                  width: "clamp(200px, 30vw, 340px)",
                  height: "auto",
                  objectFit: "contain",
                }}
                draggable={false}
              />
            </motion.div>

            {/* Wordmark */}
            <motion.div
              className="flex flex-col items-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 300,
                  fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                  letterSpacing: "0.35em",
                  color: "#e8eaf0",
                  textShadow:
                    "0 0 8px rgba(184,196,208,0.35), 0 0 25px rgba(43,127,255,0.2), 0 0 50px rgba(43,127,255,0.1)",
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                BLINDSIDE
              </h1>

              {/* Decorative rule + LOUNGE */}
              <div className="flex items-center gap-4 mt-2">
                <div
                  style={{
                    height: "1px",
                    width: "clamp(40px, 6vw, 80px)",
                    background:
                      "linear-gradient(to right, transparent, #8B3FBF)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 300,
                    fontSize: "clamp(0.75rem, 1.8vw, 1.1rem)",
                    letterSpacing: "0.65em",
                    color: "#8B3FBF",
                    textShadow:
                      "0 0 8px rgba(139,63,191,0.7), 0 0 20px rgba(139,63,191,0.4)",
                  }}
                >
                  LOUNGE
                </span>
                <div
                  style={{
                    height: "1px",
                    width: "clamp(40px, 6vw, 80px)",
                    background:
                      "linear-gradient(to left, transparent, #8B3FBF)",
                  }}
                />
              </div>

              {/* Austin Texas */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)",
                  letterSpacing: "0.4em",
                  color: "rgba(184,196,208,0.6)",
                  marginTop: "0.6rem",
                  textTransform: "uppercase",
                }}
              >
                Austin, Texas
              </motion.p>
            </motion.div>

            {/* Click hint */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center mt-16"
                >
                  <p
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.7rem",
                      letterSpacing: "0.35em",
                      color: "rgba(184,196,208,0.45)",
                      textTransform: "uppercase",
                      marginBottom: "10px",
                    }}
                  >
                    Tap to Enter
                  </p>
                  {/* Animated chevron */}
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg
                      width="20"
                      height="12"
                      viewBox="0 0 20 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L10 10L19 1"
                        stroke="rgba(43,127,255,0.5)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        /* Exit overlay — wipe up */
        <motion.div
          key="exit-overlay"
          className="fixed inset-0 z-50"
          style={{ backgroundColor: "#000000" }}
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
