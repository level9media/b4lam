import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Landing() {
  const [, navigate] = useLocation();
  const [clickCount, setClickCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  const validateInvite = trpc.auth.validateInvite.useMutation();
  const loginMutation = trpc.auth.login.useMutation();

  // Generate ambient particles
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      size: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);

  // Check if already logged in
  const { data: me } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (me) navigate("/portal");
  }, [me]);

  // 3 clicks reveals the form
  function handleCoinClick() {
    const newCount = clickCount + 1;
    setClickCount(newCount);
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
      // password is used as the PIN — we pass it through the existing login mutation
      await loginMutation.mutateAsync({ email, pin: password });
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
      {/* CSS for coin spin + ambient animations */}
      <style>{`
        @keyframes coinSpin3D {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes coinFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes ambientFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50%       { transform: translateY(-20px); opacity: 0.7; }
        }
        @keyframes scanPulse {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.5; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(0,255,209,0.15), 0 0 60px rgba(0,255,209,0.05); }
          50%       { box-shadow: 0 0 50px rgba(0,255,209,0.3), 0 0 100px rgba(0,255,209,0.1); }
        }

        .coin-wrapper {
          perspective: 800px;
          width: 220px;
          height: 220px;
          cursor: pointer;
          user-select: none;
        }
        .coin-inner {
          width: 100%;
          height: 100%;
          animation: coinSpin3D 8s linear infinite, coinFloat 4s ease-in-out infinite;
          transform-style: preserve-3d;
          border-radius: 50%;
          animation-play-state: running;
        }
        .coin-wrapper:hover .coin-inner {
          animation: coinSpin3D 3s linear infinite, coinFloat 4s ease-in-out infinite;
        }
        .coin-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          filter: drop-shadow(0 0 20px rgba(0,255,209,0.2)) drop-shadow(0 0 40px rgba(0,180,140,0.15));
          transition: filter 0.3s ease;
        }
        .coin-wrapper:hover .coin-img {
          filter: drop-shadow(0 0 30px rgba(0,255,209,0.4)) drop-shadow(0 0 60px rgba(0,180,140,0.25));
        }
        .coin-wrapper:active .coin-inner {
          animation-play-state: paused;
        }
        .fade-in-up {
          animation: fadeInUp 0.5s ease forwards;
        }
        .glow-ring {
          animation: glowPulse 3s ease-in-out infinite;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px rgba(0,0,0,0.8) inset !important;
          -webkit-text-fill-color: #f0a820 !important;
        }
      `}</style>

      {/* Ambient particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            backgroundColor: "rgba(0,255,209,0.25)",
            animation: `ambientFloat ${6 + p.delay}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 45%, rgba(0,255,209,0.05) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
          maxWidth: "440px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Spinning Coin */}
        <div
          className="coin-wrapper glow-ring"
          onClick={handleCoinClick}
          title="..."
        >
          <div className="coin-inner">
            <img
              src="/coin.png"
              alt="BALAM"
              className="coin-img"
              draggable={false}
            />
          </div>
        </div>

        {/* Tagline */}
        {!showForm && !showLogin && (
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.08em",
                lineHeight: "1.8",
                fontStyle: "italic",
              }}
            >
              By invitation only.
              <br />
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.9rem" }}>
                If you were meant to find this, you already know.
              </span>
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.1)",
                fontSize: "0.65rem",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.15em",
                marginTop: "1.5rem",
                animation: "scanPulse 4s ease-in-out infinite",
              }}
            >
              · · ·
            </p>
          </div>
        )}

        {/* Invite form — appears after 3 clicks */}
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
                fontSize: "0.65rem",
                color: "rgba(0,255,209,0.6)",
                letterSpacing: "0.25em",
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
                autoFocus
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
                  background: "rgba(0,255,209,0.08)",
                  border: "1px solid rgba(0,255,209,0.35)",
                  borderRadius: "2px",
                  padding: "0.875rem",
                  color: "#00ffd1",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  cursor: validateInvite.isPending ? "not-allowed" : "pointer",
                  opacity: validateInvite.isPending ? 0.6 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {validateInvite.isPending ? "VERIFYING..." : "PROCEED"}
              </button>
            </form>
            <p
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                color: "rgba(255,255,255,0.25)",
                fontSize: "0.75rem",
                fontFamily: "'EB Garamond', serif",
                cursor: "pointer",
                fontStyle: "italic",
              }}
              onClick={() => { setShowForm(false); setShowLogin(true); }}
            >
              Already a member? Enter here.
            </p>
          </div>
        )}

        {/* Login form — email + password */}
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
                fontSize: "0.65rem",
                color: "rgba(200,134,10,0.7)",
                letterSpacing: "0.25em",
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
                placeholder="Email address"
                required
                autoFocus
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(200,134,10,0.3)",
                  borderRadius: "2px",
                  padding: "0.875rem 1rem",
                  color: "#f0a820",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "1rem",
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
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.6 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {isSubmitting ? "ENTERING..." : "ENTER"}
              </button>
            </form>
            <p
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                color: "rgba(255,255,255,0.25)",
                fontSize: "0.75rem",
                fontFamily: "'EB Garamond', serif",
                cursor: "pointer",
                fontStyle: "italic",
              }}
              onClick={() => { setShowLogin(false); setShowForm(true); }}
            >
              Have an invite code?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
