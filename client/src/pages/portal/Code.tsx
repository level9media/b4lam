import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

function CountdownTimer({ expiresAt }: { expiresAt: number }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = Date.now();
      const diff = expiresAt - now;
      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <span
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "1rem",
        color: "rgba(200,134,10,0.7)",
        letterSpacing: "0.1em",
      }}
    >
      {timeLeft}
    </span>
  );
}

export default function CodePage() {
  const { data: code, isLoading } = trpc.codes.tonight.useQuery(undefined, {
    refetchInterval: 60_000, // refresh every minute
  });

  const [revealed, setRevealed] = useState(false);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "'EB Garamond', serif",
          fontStyle: "italic",
        }}
      >
        Consulting the stars...
      </div>
    );
  }

  if (!code) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div
          style={{
            marginTop: "4rem",
            padding: "2.5rem",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "4px",
          }}
        >
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.2em",
              marginBottom: "1rem",
            }}
          >
            TONIGHT'S CODE
          </p>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.4)",
              fontStyle: "italic",
            }}
          >
            No code has been set for tonight.
          </p>
          <p
            style={{
              marginTop: "0.75rem",
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            color: "rgba(200,134,10,0.6)",
            letterSpacing: "0.25em",
            marginBottom: "0.5rem",
          }}
        >
          TONIGHT'S ENTRY CODE
        </p>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.3)",
            fontStyle: "italic",
          }}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Code reveal card */}
      <div
        style={{
          padding: "2.5rem 2rem",
          border: "1px solid rgba(200,134,10,0.25)",
          borderRadius: "4px",
          background: "rgba(200,134,10,0.04)",
          textAlign: "center",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, rgba(200,134,10,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {!revealed ? (
          <div>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "1rem",
                color: "rgba(255,255,255,0.35)",
                fontStyle: "italic",
                marginBottom: "1.5rem",
              }}
            >
              Tap to reveal tonight's code
            </p>
            <button
              onClick={() => setRevealed(true)}
              style={{
                background: "rgba(200,134,10,0.1)",
                border: "1px solid rgba(200,134,10,0.4)",
                borderRadius: "2px",
                padding: "0.875rem 2rem",
                color: "#f0a820",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              REVEAL
            </button>
          </div>
        ) : (
          <div className="fade-in-up">
            {/* The code */}
            <p
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: "2.5rem",
                color: "#f0a820",
                letterSpacing: "0.2em",
                textShadow: "0 0 30px rgba(200,134,10,0.6), 0 0 60px rgba(200,134,10,0.3)",
                marginBottom: "0.5rem",
                lineHeight: 1.2,
              }}
            >
              {code.word}
            </p>

            {/* Phonetic hint */}
            {code.phonetic && (
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.9rem",
                  color: "rgba(200,134,10,0.5)",
                  fontStyle: "italic",
                  marginBottom: "1.5rem",
                }}
              >
                "{code.phonetic}"
              </p>
            )}

            {/* Expires */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.55rem",
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.15em",
                }}
              >
                EXPIRES IN
              </p>
              <CountdownTimer expiresAt={code.expiresAt} />
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div
        style={{
          padding: "1.25rem",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "4px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.55rem",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.2em",
            marginBottom: "0.75rem",
          }}
        >
          INSTRUCTIONS
        </p>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7,
          }}
        >
          Speak this word to the host at the door. Do not share this code outside the membership. 
          The code changes nightly at midnight.
        </p>
      </div>
    </div>
  );
}
