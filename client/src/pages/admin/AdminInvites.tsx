import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Copy, Plus } from "lucide-react";

export default function AdminInvites() {
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: invites, refetch } = trpc.admin.getInvites.useQuery();
  const generateInvites = trpc.admin.generateInvites.useMutation();
  const revokeInvite = trpc.admin.revokeInvite.useMutation();

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      await generateInvites.mutateAsync({ count });
      toast.success(`${count} invite code${count > 1 ? "s" : ""} generated.`);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to generate invites.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRevoke(id: number) {
    try {
      await revokeInvite.mutateAsync({ id });
      toast.success("Invite revoked.");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke.");
    }
  }

  function copyInviteLink(code: string) {
    const url = `${window.location.origin}/register?invite=${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied.");
  }

  const unused = invites?.filter((i: any) => !i.usedAt && !i.revokedAt) ?? [];
  const used = invites?.filter((i: any) => i.usedAt) ?? [];
  const revoked = invites?.filter((i: any) => i.revokedAt && !i.usedAt) ?? [];

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
          Invite Codes
        </h1>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {unused.length} available · {used.length} used · {revoked.length} revoked
        </p>
      </div>

      {/* Generate */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          border: "1px solid rgba(200,134,10,0.15)",
          borderRadius: "4px",
          background: "rgba(200,134,10,0.03)",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.55rem",
              color: "rgba(200,134,10,0.5)",
              letterSpacing: "0.2em",
              marginBottom: "0.4rem",
            }}
          >
            GENERATE INVITES
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[1, 3, 5, 10].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                style={{
                  padding: "0.4rem 0.75rem",
                  border: `1px solid ${count === n ? "rgba(200,134,10,0.5)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "2px",
                  background: count === n ? "rgba(200,134,10,0.1)" : "transparent",
                  color: count === n ? "#f0a820" : "rgba(255,255,255,0.35)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.25rem",
            background: "rgba(200,134,10,0.1)",
            border: "1px solid rgba(200,134,10,0.35)",
            borderRadius: "2px",
            color: "#f0a820",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            cursor: isGenerating ? "not-allowed" : "pointer",
            opacity: isGenerating ? 0.6 : 1,
            flexShrink: 0,
          }}
        >
          <Plus size={14} />
          GENERATE
        </button>
      </div>

      {/* Unused invites */}
      {unused.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              color: "rgba(0,255,209,0.4)",
              letterSpacing: "0.2em",
              marginBottom: "0.75rem",
            }}
          >
            AVAILABLE ({unused.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {unused.map((invite: any) => (
              <div
                key={invite.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  border: "1px solid rgba(0,255,209,0.1)",
                  borderRadius: "4px",
                  background: "rgba(0,255,209,0.02)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.6)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {invite.code}
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => copyInviteLink(invite.code)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.35rem 0.75rem",
                      background: "rgba(0,255,209,0.08)",
                      border: "1px solid rgba(0,255,209,0.2)",
                      borderRadius: "2px",
                      color: "#00ffd1",
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                    }}
                  >
                    <Copy size={11} />
                    COPY LINK
                  </button>
                  <button
                    onClick={() => handleRevoke(invite.id)}
                    style={{
                      padding: "0.35rem 0.75rem",
                      background: "rgba(200,80,80,0.06)",
                      border: "1px solid rgba(200,80,80,0.2)",
                      borderRadius: "2px",
                      color: "rgba(200,80,80,0.6)",
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                    }}
                  >
                    REVOKE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Used invites */}
      {used.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.2em",
              marginBottom: "0.75rem",
            }}
          >
            USED ({used.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {used.map((invite: any) => (
              <div
                key={invite.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "4px",
                  opacity: 0.5,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {invite.code}
                </p>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {invite.usedBy ? `Member #${invite.usedBy}` : "Unknown"}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    {new Date(invite.usedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
