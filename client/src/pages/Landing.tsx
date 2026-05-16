import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Mayan jaguar glyph SVG — the B4LAM sigil
function JaguarSigil({ clickCount }: { clickCount: number }) {
  const glowIntensity = Math.min(clickCount * 0.3, 1);
  return (
    <svg
      viewBox="0 0 200 200"
      style={{
        width: "100%",
        height: "100%",
        filter: `drop-shadow(0 0 ${8 + clickCount * 8}px rgba(0, 255, 209, ${0.4 + glowIntensity * 0.5}))`,
        transition: "filter 0.4s ease",
      }}
    >
      {/* Outer ring */}
      <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0,255,209,0.3)" strokeWidth="1" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(0,255,209,0.15)" strokeWidth="0.5" />

      {/* Jaguar face — stylized Mayan glyph */}
      {/* Head outline */}
      <path
        d="M60 70 Q50 60 55 45 Q65 35 80 40 Q90 30 100 30 Q110 30 120 40 Q135 35 145 45 Q150 60 140 70 Q155 80 155 100 Q155 130 140 145 Q130 160 100 165 Q70 160 60 145 Q45 130 45 100 Q45 80 60 70Z"
        fill="rgba(0,255,209,0.05)"
        stroke="rgba(0,255,209,0.6)"
        strokeWidth="1.5"
      />

      {/* Eyes — jaguar spots */}
      <ellipse cx="78" cy="85" rx="10" ry="8" fill="none" stroke="rgba(0,255,209,0.8)" strokeWidth="1.5" />
      <ellipse cx="122" cy="85" rx="10" ry="8" fill="none" stroke="rgba(0,255,209,0.8)" strokeWidth="1.5" />
      <circle cx="78" cy="85" r="4" fill="rgba(0,255,209,0.6)" />
      <circle cx="122" cy="85" r="4" fill="rgba(0,255,209,0.6)" />
      {/* Eye shine */}
      <circle cx="80" cy="83" r="1.5" fill="rgba(255,255,255,0.8)" />
      <circle cx="124" cy="83" r="1.5" fill="rgba(255,255,255,0.8)" />

      {/* Nose */}
      <path d="M95 100 L100 95 L105 100 L100 105Z" fill="rgba(0,255,209,0.5)" />

      {/* Mouth — jaguar snarl */}
      <path d="M80 115 Q90 125 100 120 Q110 125 120 115" fill="none" stroke="rgba(0,255,209,0.7)" strokeWidth="1.5" />
      <path d="M85 115 L85 125 M115 115 L115 125" fill="none" stroke="rgba(0,255,209,0.5)" strokeWidth="1" />

      {/* Mayan geometric patterns on forehead */}
      <path d="M85 60 L100 50 L115 60 L115 70 L100 65 L85 70Z" fill="none" stroke="rgba(0,255,209,0.4)" strokeWidth="1" />

      {/* Whisker dots */}
      {[72, 76, 80].map((y, i) => (
        <circle key={`l${i}`} cx={60 + i * 5} cy={y} r="1.5" fill="rgba(0,255,209,0.4)" />
      ))}
      {[72, 76, 80].map((y, i) => (
        <circle key={`r${i}`} cx={140 - i * 5} cy={y} r="1.5" fill="rgba(0,255,209,0.4)" />
      ))}

      {/* Mayan calendar ring marks */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2 - Math.PI / 2;
        const r = 90;
        const x = 100 + r * Math.cos(angle);
        const y = 100 + r * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 5 === 0 ? 2.5 : 1.5}
            fill={`rgba(0,255,209,${i % 5 === 0 ? 0.6 : 0.3})`}
          />
        );
      })}

      {/* B4LAM text at bottom */}
      <text
        x="100"
        y="155"
        textAnchor="middle"
        fill="rgba(0,255,209,0.8)"
        fontSize="12"
        fontFamily="'Space Mono', monospace"
        letterSpacing="4"
      >
        B4LAM
      </text>
    </svg>
  );
}

export default function Landing() {
  const [, navigate] = useLocation();
  const [clickCount, setClickCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validateInvite = trpc.auth.validateInvite.useMutation();
  const loginMutation = trpc.auth.login.useMutation();

  // Generate ambient particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Check if already logged in
  const { data: me } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (me) {
      navigate("/portal");
    }
  }, [me]);

  // Handle sigil clicks — 3 clicks reveals the form
  function handleSigilClick() {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => setClickCount(0), 3000);

    if (newCount >= 3) {
      setShowForm(true);
      setClickCount(0);
    }
  }

  async function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    try {
      await validateInvite.mutateAsync({ code: inviteCode.trim() });
      navigate(`/register?invite=${inviteCode.trim().toUpperCase()}`);
    } catch (err: any) {
      toast.error(err.message || "Invalid invite code.");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await loginMutation.mutateAsync({ email, pin });
      navigate("/portal");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050508",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "2rem",
      }}
    >
      {/* Ambient background particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: "2px",
            height: "2px",
            borderRadius: "50%",
            backgroundColor: "rgba(0,255,209,0.3)",
            animation: `ambientFloat ${6 + p.delay}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Cenote depth gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,255,209,0.04) 0%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3rem",
          maxWidth: "480px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Sigil */}
        <div
          onClick={handleSigilClick}
          className="glyph-pulse"
          style={{
            width: "180px",
            height: "180px",
            cursor: "pointer",
            userSelect: "none",
            transition: "transform 0.15s ease",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(0.96)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
          }}
          title="..."
        >
          <JaguarSigil clickCount={clickCount} />
        </div>

        {/* Tagline */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.08em",
              lineHeight: "1.8",
              fontStyle: "italic",
            }}
          >
            By invitation only.
            <br />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
              If you were meant to find this, you already know.
            </span>
          </p>
        </div>

        {/* Hidden invite form — appears after 3 clicks */}
        {showForm && !showLogin && (
          <div
            className="fade-in-up"
            style={{
              width: "100%",
              padding: "2rem",
              border: "1px solid rgba(0,255,209,0.2)",
              borderRadius: "4px",
              background: "rgba(0,255,209,0.03)",
              backdropFilter: "blur(10px)",
            }}
          >
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.7rem",
                color: "rgba(0,255,209,0.6)",
                letterSpacing: "0.2em",
                textAlign: "center",
                marginBottom: "1.5rem",
              }}
            >
              ENTER YOUR INVITATION
            </p>
            <form onSubmit={handleInviteSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="INVITE CODE"
                maxLength={20}
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(0,255,209,0.3)",
                  borderRadius: "2px",
                  padding: "0.875rem 1rem",
                  color: "#00ffd1",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "1rem",
                  letterSpacing: "0.2em",
                  textAlign: "center",
                  outline: "none",
                  width: "100%",
                }}
              />
              <button
                type="submit"
                disabled={validateInvite.isPending || !inviteCode.trim()}
                style={{
                  background: "rgba(0,255,209,0.1)",
                  border: "1px solid rgba(0,255,209,0.4)",
                  borderRadius: "2px",
                  padding: "0.875rem",
                  color: "#00ffd1",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  opacity: validateInvite.isPending ? 0.6 : 1,
                }}
              >
                {validateInvite.isPending ? "VERIFYING..." : "PROCEED"}
              </button>
            </form>
            <p
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.75rem",
                fontFamily: "'EB Garamond', serif",
                cursor: "pointer",
              }}
              onClick={() => setShowLogin(true)}
            >
              Already a member? Enter here.
            </p>
          </div>
        )}

        {/* Login form */}
        {showLogin && (
          <div
            className="fade-in-up"
            style={{
              width: "100%",
              padding: "2rem",
              border: "1px solid rgba(200,134,10,0.2)",
              borderRadius: "4px",
              background: "rgba(200,134,10,0.03)",
              backdropFilter: "blur(10px)",
            }}
          >
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.7rem",
                color: "rgba(200,134,10,0.7)",
                letterSpacing: "0.2em",
                textAlign: "center",
                marginBottom: "1.5rem",
              }}
            >
              MEMBER ACCESS
            </p>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(200,134,10,0.3)",
                  borderRadius: "2px",
                  padding: "0.875rem 1rem",
                  color: "#f0a820",
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1rem",
                  outline: "none",
                  width: "100%",
                }}
              />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="6-digit PIN"
                maxLength={6}
                pattern="\d{6}"
                required
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(200,134,10,0.3)",
                  borderRadius: "2px",
                  padding: "0.875rem 1rem",
                  color: "#f0a820",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "1.2rem",
                  letterSpacing: "0.3em",
                  textAlign: "center",
                  outline: "none",
                  width: "100%",
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: "rgba(200,134,10,0.1)",
                  border: "1px solid rgba(200,134,10,0.4)",
                  borderRadius: "2px",
                  padding: "0.875rem",
                  color: "#f0a820",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? "ENTERING..." : "ENTER"}
              </button>
            </form>
            <p
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.75rem",
                fontFamily: "'EB Garamond', serif",
                cursor: "pointer",
              }}
              onClick={() => { setShowLogin(false); setShowForm(true); }}
            >
              Have an invite code?
            </p>
          </div>
        )}

        {/* Click hint — only show if form not revealed */}
        {!showForm && !showLogin && (
          <p
            style={{
              color: "rgba(255,255,255,0.1)",
              fontSize: "0.65rem",
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.15em",
              marginTop: "-1rem",
              animation: "scanPulse 4s ease-in-out infinite",
            }}
          >
            · · ·
          </p>
        )}
      </div>
    </div>
  );
}
