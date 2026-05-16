import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ReservationsPage() {
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("21:00");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: reservations, refetch } = trpc.reservations.myReservations.useQuery();
  const createReservation = trpc.reservations.create.useMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createReservation.mutateAsync({ partySize, date, time, notes: notes || undefined });
      toast.success("Reservation submitted. We'll confirm shortly.");
      setDate("");
      setNotes("");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit reservation.");
    } finally {
      setIsSubmitting(false);
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
    color: "rgba(0,255,209,0.5)",
    letterSpacing: "0.2em",
    marginBottom: "0.4rem",
  };

  const statusColor: Record<string, string> = {
    pending: "#c8860a",
    confirmed: "#00ffd1",
    cancelled: "rgba(255,255,255,0.25)",
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* New reservation form */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.2em",
            marginBottom: "1.25rem",
          }}
        >
          REQUEST A RESERVATION
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1.5rem",
            border: "1px solid rgba(0,255,209,0.12)",
            borderRadius: "4px",
            background: "rgba(0,255,209,0.02)",
          }}
        >
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>DATE</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
                style={{
                  ...inputStyle,
                  colorScheme: "dark",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>TIME</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  colorScheme: "dark",
                }}
              >
                {["20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>PARTY SIZE</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPartySize(n)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    border: `1px solid ${partySize === n ? "rgba(0,255,209,0.5)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "2px",
                    background: partySize === n ? "rgba(0,255,209,0.1)" : "transparent",
                    color: partySize === n ? "#00ffd1" : "rgba(255,255,255,0.4)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>SPECIAL REQUESTS (OPTIONAL)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Any special requests or notes..."
              style={{
                ...inputStyle,
                resize: "vertical",
                lineHeight: 1.6,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "0.875rem",
              background: "rgba(0,255,209,0.1)",
              border: "1px solid rgba(0,255,209,0.35)",
              borderRadius: "2px",
              color: "#00ffd1",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? "SUBMITTING..." : "REQUEST RESERVATION"}
          </button>
        </form>
      </div>

      {/* Past reservations */}
      {reservations && reservations.length > 0 && (
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
            YOUR RESERVATIONS
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {reservations.map((r: any) => (
              <div
                key={r.id}
                style={{
                  padding: "1rem 1.25rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {r.date} at {r.time}
                  </p>
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    Party of {r.partySize}
                    {r.notes ? ` · ${r.notes}` : ""}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.6rem",
                    color: statusColor[r.status] || "rgba(255,255,255,0.3)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
