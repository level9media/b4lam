import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  pending: "#c8860a",
  confirmed: "#00ffd1",
  cancelled: "rgba(200,80,80,0.5)",
};

export default function AdminReservations() {
  const { data: reservations, refetch } = trpc.reservations.all.useQuery();
  const updateStatus = trpc.reservations.updateStatus.useMutation();

  async function handleStatus(id: number, status: string) {
    try {
      await updateStatus.mutateAsync({ id, status: status as any });
      toast.success(`Reservation ${status}.`);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update.");
    }
  }

  const pending = reservations?.filter((r: any) => r.status === "pending") ?? [];
  const confirmed = reservations?.filter((r: any) => r.status === "confirmed") ?? [];
  const cancelled = reservations?.filter((r: any) => r.status === "cancelled") ?? [];

  function ReservationCard({ r }: { r: any }) {
    return (
      <div
        style={{
          padding: "1.25rem",
          border: `1px solid ${STATUS_COLORS[r.status]}22`,
          borderRadius: "4px",
          background: `${STATUS_COLORS[r.status]}04`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.75rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.75)",
                marginBottom: "0.2rem",
              }}
            >
              {r.member?.name || "Unknown"}
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              {r.date} at {r.time} · Party of {r.partySize}
            </p>
            {r.notes && (
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.3)",
                  fontStyle: "italic",
                  marginTop: "0.25rem",
                }}
              >
                "{r.notes}"
              </p>
            )}
          </div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.55rem",
              color: STATUS_COLORS[r.status],
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: `1px solid ${STATUS_COLORS[r.status]}44`,
              padding: "0.2rem 0.5rem",
              borderRadius: "2px",
            }}
          >
            {r.status}
          </span>
        </div>

        {r.status === "pending" && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => handleStatus(r.id, "confirmed")}
              style={{
                padding: "0.5rem 1rem",
                background: "rgba(0,255,209,0.08)",
                border: "1px solid rgba(0,255,209,0.3)",
                borderRadius: "2px",
                color: "#00ffd1",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              CONFIRM
            </button>
            <button
              onClick={() => handleStatus(r.id, "cancelled")}
              style={{
                padding: "0.5rem 1rem",
                background: "rgba(200,80,80,0.06)",
                border: "1px solid rgba(200,80,80,0.2)",
                borderRadius: "2px",
                color: "rgba(200,80,80,0.6)",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              DECLINE
            </button>
          </div>
        )}
      </div>
    );
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
          Reservations
        </h1>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {pending.length} pending · {confirmed.length} confirmed
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              color: "rgba(200,134,10,0.5)",
              letterSpacing: "0.2em",
              marginBottom: "0.75rem",
            }}
          >
            PENDING REVIEW
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pending.map((r: any) => <ReservationCard key={r.id} r={r} />)}
          </div>
        </div>
      )}

      {/* Confirmed */}
      {confirmed.length > 0 && (
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
            CONFIRMED
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {confirmed.map((r: any) => <ReservationCard key={r.id} r={r} />)}
          </div>
        </div>
      )}

      {reservations?.length === 0 && (
        <p
          style={{
            textAlign: "center",
            padding: "3rem",
            fontFamily: "'EB Garamond', serif",
            color: "rgba(255,255,255,0.2)",
            fontStyle: "italic",
          }}
        >
          No reservations yet.
        </p>
      )}
    </div>
  );
}
