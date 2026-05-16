import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Search, ChevronDown } from "lucide-react";

export default function AdminMembers() {
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustNote, setAdjustNote] = useState("");

  const { data: members, refetch } = trpc.admin.getMembers.useQuery();
  const updateRole = trpc.admin.updateMemberRole.useMutation();
  const adjustTokens = trpc.admin.adjustTokens.useMutation();

  const filtered = members
    ? members.filter(
        (m: any) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  async function handleRoleChange(memberId: number, role: string) {
    try {
      await updateRole.mutateAsync({ memberId, role: role as any });
      toast.success("Role updated.");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update role.");
    }
  }

  async function handleAdjustTokens() {
    if (!selectedMember || adjustAmount === 0) return;
    try {
      await adjustTokens.mutateAsync({
        memberId: selectedMember.id,
        amount: adjustAmount,
        description: adjustNote || `Admin adjustment: ${adjustAmount > 0 ? "+" : ""}${adjustAmount} tokens`,
      });
      toast.success(`Tokens adjusted for ${selectedMember.name}.`);
      setSelectedMember(null);
      setAdjustAmount(0);
      setAdjustNote("");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to adjust tokens.");
    }
  }

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
          Members
        </h1>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {members?.length ?? 0} total members
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          position: "relative",
          marginBottom: "1.5rem",
          maxWidth: "400px",
        }}
      >
        <Search
          size={14}
          style={{
            position: "absolute",
            left: "0.875rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(255,255,255,0.25)",
          }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{
            width: "100%",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "2px",
            padding: "0.625rem 1rem 0.625rem 2.5rem",
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.95rem",
            outline: "none",
          }}
        />
      </div>

      {/* Members table */}
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 80px 80px 120px",
            gap: "1rem",
            padding: "0.75rem 1rem",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {["NAME", "EMAIL", "TOKENS", "ROLE", "ACTIONS"].map((col) => (
            <p
              key={col}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.55rem",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.15em",
              }}
            >
              {col}
            </p>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((member: any) => (
          <div
            key={member.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 80px 80px 120px",
              gap: "1rem",
              padding: "0.875rem 1rem",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.7)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {member.name}
            </p>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.35)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {member.email}
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.8rem",
                color: "#00ffd1",
              }}
            >
              ◈ {member.tokenBalance}
            </p>
            <select
              value={member.role}
              onChange={(e) => handleRoleChange(member.id, e.target.value)}
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
                padding: "0.25rem 0.5rem",
                color:
                  member.role === "admin"
                    ? "#f0a820"
                    : member.role === "staff"
                    ? "#00ffd1"
                    : "rgba(255,255,255,0.5)",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.55rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="member">MEMBER</option>
              <option value="staff">STAFF</option>
              <option value="admin">ADMIN</option>
            </select>
            <button
              onClick={() => setSelectedMember(member)}
              style={{
                padding: "0.3rem 0.625rem",
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
              ADJUST TOKENS
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <p
            style={{
              padding: "2rem",
              textAlign: "center",
              fontFamily: "'EB Garamond', serif",
              color: "rgba(255,255,255,0.2)",
              fontStyle: "italic",
            }}
          >
            No members found.
          </p>
        )}
      </div>

      {/* Token adjustment modal */}
      {selectedMember && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={() => setSelectedMember(null)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            style={{
              position: "relative",
              background: "#0d0d14",
              border: "1px solid rgba(0,255,209,0.2)",
              borderRadius: "4px",
              padding: "2rem",
              width: "100%",
              maxWidth: "380px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
              }}
            >
              Adjust Tokens
            </h3>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "1.5rem",
              }}
            >
              {selectedMember.name} · Current balance: ◈ {selectedMember.tokenBalance}
            </p>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.55rem",
                  color: "rgba(0,255,209,0.5)",
                  letterSpacing: "0.2em",
                  marginBottom: "0.4rem",
                }}
              >
                AMOUNT (+ to add, - to deduct)
              </label>
              <input
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(0,255,209,0.25)",
                  borderRadius: "2px",
                  padding: "0.75rem 1rem",
                  color: adjustAmount > 0 ? "#00ffd1" : adjustAmount < 0 ? "#c8860a" : "rgba(255,255,255,0.5)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "1.2rem",
                  textAlign: "center",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.55rem",
                  color: "rgba(0,255,209,0.5)",
                  letterSpacing: "0.2em",
                  marginBottom: "0.4rem",
                }}
              >
                NOTE (OPTIONAL)
              </label>
              <input
                type="text"
                value={adjustNote}
                onChange={(e) => setAdjustNote(e.target.value)}
                placeholder="Reason for adjustment"
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "2px",
                  padding: "0.75rem 1rem",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setSelectedMember(null)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "2px",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleAdjustTokens}
                disabled={adjustAmount === 0 || adjustTokens.isPending}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "rgba(0,255,209,0.1)",
                  border: "1px solid rgba(0,255,209,0.35)",
                  borderRadius: "2px",
                  color: "#00ffd1",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  cursor: adjustAmount === 0 ? "not-allowed" : "pointer",
                  opacity: adjustAmount === 0 || adjustTokens.isPending ? 0.5 : 1,
                }}
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
