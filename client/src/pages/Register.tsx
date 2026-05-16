import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Register() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const inviteCode = params.get("invite") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = trpc.auth.register.useMutation();

  // Redirect if no invite code
  useEffect(() => {
    if (!inviteCode) {
      navigate("/");
    }
  }, [inviteCode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (pin !== pinConfirm) {
      toast.error("PINs do not match.");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      toast.error("PIN must be exactly 6 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register.mutateAsync({ inviteCode, name, email, pin });
      toast.success("Welcome to B4LAM.");
      navigate("/portal");
    } catch (err: any) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(0,255,209,0.25)",
    borderRadius: "2px",
    padding: "0.875rem 1rem",
    color: "rgba(255,255,255,0.9)",
    fontFamily: "'EB Garamond', serif",
    fontSize: "1rem",
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050508",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "radial-gradient(ellipse at 50% 30%, rgba(0,255,209,0.04) 0%, #050508 60%)",
      }}
    >
      <div style={{ maxWidth: "420px", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "1.5rem",
              color: "#00ffd1",
              letterSpacing: "0.15em",
              textShadow: "0 0 20px rgba(0,255,209,0.4)",
              marginBottom: "0.5rem",
            }}
          >
            B4LAM
          </h1>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.9rem",
              fontStyle: "italic",
            }}
          >
            Create your membership
          </p>
          {inviteCode && (
            <p
              style={{
                marginTop: "0.75rem",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.65rem",
                color: "rgba(0,255,209,0.5)",
                letterSpacing: "0.15em",
              }}
            >
              INVITE: {inviteCode}
            </p>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "2rem",
            border: "1px solid rgba(0,255,209,0.15)",
            borderRadius: "4px",
            background: "rgba(0,255,209,0.02)",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                color: "rgba(0,255,209,0.6)",
                letterSpacing: "0.2em",
                marginBottom: "0.4rem",
              }}
            >
              NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                color: "rgba(0,255,209,0.6)",
                letterSpacing: "0.2em",
                marginBottom: "0.4rem",
              }}
            >
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                color: "rgba(0,255,209,0.6)",
                letterSpacing: "0.2em",
                marginBottom: "0.4rem",
              }}
            >
              6-DIGIT PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              placeholder="••••••"
              style={{
                ...inputStyle,
                fontFamily: "'Space Mono', monospace",
                fontSize: "1.5rem",
                letterSpacing: "0.5em",
                textAlign: "center",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                color: "rgba(0,255,209,0.6)",
                letterSpacing: "0.2em",
                marginBottom: "0.4rem",
              }}
            >
              CONFIRM PIN
            </label>
            <input
              type="password"
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              placeholder="••••••"
              style={{
                ...inputStyle,
                fontFamily: "'Space Mono', monospace",
                fontSize: "1.5rem",
                letterSpacing: "0.5em",
                textAlign: "center",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: "0.5rem",
              background: isSubmitting ? "rgba(0,255,209,0.05)" : "rgba(0,255,209,0.1)",
              border: "1px solid rgba(0,255,209,0.4)",
              borderRadius: "2px",
              padding: "1rem",
              color: "#00ffd1",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? "INITIATING..." : "ENTER THE TEMPLE"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "rgba(255,255,255,0.2)",
            fontSize: "0.7rem",
            fontFamily: "'EB Garamond', serif",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          ← Return
        </p>
      </div>
    </div>
  );
}
