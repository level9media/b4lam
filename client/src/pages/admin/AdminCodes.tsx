import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";

const MAYAN_WORDS = [
  "Itzamná", "Kukulcán", "Chaac", "Ixchel", "Hunab Ku",
  "Bacab", "Ah Puch", "Ek Chuah", "Ixtab", "Xibalbá",
  "Palenque", "Tikal", "Copán", "Chichén", "Uxmal",
  "Cenote", "Copal", "Balché", "Pib", "Atole",
  "Jaguar", "Quetzal", "Ceiba", "Cacao", "Obsidian",
];

export default function AdminCodes() {
  const [word, setWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [expiresHours, setExpiresHours] = useState(8);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: codes, refetch } = trpc.codes.list.useQuery();
  const { data: tonight } = trpc.codes.tonight.useQuery();
  const setCode = trpc.codes.set.useMutation();
  const deactivateCode = trpc.codes.deactivate.useMutation();

  function randomWord() {
    const w = MAYAN_WORDS[Math.floor(Math.random() * MAYAN_WORDS.length)];
    setWord(w);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!word.trim()) return;
    setIsSubmitting(true);
    try {
      const expiresAt = Date.now() + expiresHours * 3600 * 1000;
      await setCode.mutateAsync({ word: word.trim(), phonetic: phonetic.trim() || undefined, expiresAt });
      toast.success("Tonight's code has been set.");
      setWord("");
      setPhonetic("");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to set code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeactivate(id: number) {
    try {
      await deactivateCode.mutateAsync({ id });
      toast.success("Code deactivated.");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate.");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "2px",
    padding: "0.75rem 1rem",
    color: "rgba(255,255,255,0.8)",
    fontFamily: "'EB Garamond', serif",
    fontSize: "1rem",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Cinzel', serif",
    fontSize: "0.55rem",
    color: "rgba(200,134,10,0.5)",
    letterSpacing: "0.2em",
    marginBottom: "0.4rem",
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.25rem",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.05em",
            marginBottom: "0.25rem",
          }}
        >
          Nightly Codes
        </h1>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Set the entry code members speak at the door
        </p>
      </div>

      {/* Active code banner */}
      {tonight && (
        <div
          style={{
            padding: "1.25rem 1.5rem",
            border: "1px solid rgba(200,134,10,0.3)",
            borderRadius: "4px",
            background: "rgba(200,134,10,0.06)",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.55rem",
                color: "rgba(200,134,10,0.6)",
                letterSpacing: "0.2em",
                marginBottom: "0.4rem",
              }}
            >
              TONIGHT'S ACTIVE CODE
            </p>
            <p
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: "1.5rem",
                color: "#f0a820",
                textShadow: "0 0 20px rgba(200,134,10,0.5)",
              }}
            >
              {tonight.word}
            </p>
            {tonight.phonetic && (
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.8rem",
                  color: "rgba(200,134,10,0.4)",
                  fontStyle: "italic",
                }}
              >
                "{tonight.phonetic}"
              </p>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "0.5rem",
              }}
            >
              Expires {new Date(tonight.expiresAt).toLocaleTimeString()}
            </p>
            <button
              onClick={() => handleDeactivate(tonight.id)}
              style={{
                padding: "0.4rem 0.875rem",
                background: "rgba(200,80,80,0.08)",
                border: "1px solid rgba(200,80,80,0.25)",
                borderRadius: "2px",
                color: "rgba(200,80,80,0.7)",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.55rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              DEACTIVATE
            </button>
          </div>
        </div>
      )}

      {/* Set new code form */}
      <div
        style={{
          padding: "1.5rem",
          border: "1px solid rgba(200,134,10,0.12)",
          borderRadius: "4px",
          background: "rgba(200,134,10,0.02)",
          marginBottom: "2rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.2em",
            marginBottom: "1.25rem",
          }}
        >
          SET NEW CODE
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>WORD</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                required
                maxLength={50}
                placeholder="Enter the secret word"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={randomWord}
                title="Random Mayan word"
                style={{
                  padding: "0.75rem",
                  background: "rgba(200,134,10,0.1)",
                  border: "1px solid rgba(200,134,10,0.3)",
                  borderRadius: "2px",
                  color: "#f0a820",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Wand2 size={16} />
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>PHONETIC HINT (OPTIONAL)</label>
            <input
              type="text"
              value={phonetic}
              onChange={(e) => setPhonetic(e.target.value)}
              maxLength={100}
              placeholder="How to pronounce it"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>EXPIRES IN (HOURS)</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[4, 6, 8, 12, 24].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setExpiresHours(h)}
                  style={{
                    padding: "0.5rem 0.875rem",
                    border: `1px solid ${expiresHours === h ? "rgba(200,134,10,0.5)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "2px",
                    background: expiresHours === h ? "rgba(200,134,10,0.1)" : "transparent",
                    color: expiresHours === h ? "#f0a820" : "rgba(255,255,255,0.35)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !word.trim()}
            style={{
              padding: "0.875rem",
              background: "rgba(200,134,10,0.1)",
              border: "1px solid rgba(200,134,10,0.4)",
              borderRadius: "2px",
              color: "#f0a820",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              cursor: isSubmitting || !word.trim() ? "not-allowed" : "pointer",
              opacity: isSubmitting || !word.trim() ? 0.5 : 1,
            }}
          >
            {isSubmitting ? "SETTING CODE..." : "SET TONIGHT'S CODE"}
          </button>
        </form>
      </div>

      {/* Code history */}
      {codes && codes.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.2em",
              marginBottom: "0.75rem",
            }}
          >
            CODE HISTORY
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {codes.slice(0, 10).map((code: any) => (
              <div
                key={code.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.01)",
                  opacity: code.isActive ? 1 : 0.5,
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.85rem",
                      color: code.isActive ? "#f0a820" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {code.word}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.2)",
                      marginTop: "0.1rem",
                    }}
                  >
                    {new Date(code.createdAt).toLocaleDateString()} · Expires {new Date(code.expiresAt).toLocaleTimeString()}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.55rem",
                    color: code.isActive ? "#00ffd1" : "rgba(255,255,255,0.2)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {code.isActive ? "ACTIVE" : "EXPIRED"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
