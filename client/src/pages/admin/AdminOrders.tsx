import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  pending: "#c8860a",
  preparing: "#00ffd1",
  ready: "#00ff88",
  completed: "rgba(255,255,255,0.3)",
  cancelled: "rgba(200,80,80,0.5)",
};

const NEXT_STATUS: Record<string, string> = {
  pending: "preparing",
  preparing: "ready",
  ready: "completed",
};

export default function AdminOrders() {
  const { data: orders, refetch } = trpc.orders.all.useQuery(undefined, {
    refetchInterval: 15_000,
  });
  const updateStatus = trpc.orders.updateStatus.useMutation();

  async function handleAdvance(orderId: number, currentStatus: string) {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    try {
      await updateStatus.mutateAsync({ orderId, status: next as any });
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    }
  }

  async function handleCancel(orderId: number) {
    if (!confirm("Cancel this order and refund tokens?")) return;
    try {
      await updateStatus.mutateAsync({ orderId, status: "cancelled" });
      toast.success("Order cancelled and tokens refunded.");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel.");
    }
  }

  const active = orders?.filter((o: any) => !["completed", "cancelled"].includes(o.status)) ?? [];
  const past = orders?.filter((o: any) => ["completed", "cancelled"].includes(o.status)) ?? [];

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
          Orders
        </h1>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {active.length} active · auto-refreshes every 15s
        </p>
      </div>

      {/* Active orders */}
      {active.length > 0 && (
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
            ACTIVE ORDERS
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {active.map((order: any) => (
              <div
                key={order.id}
                style={{
                  padding: "1.25rem",
                  border: `1px solid ${STATUS_COLORS[order.status]}33`,
                  borderRadius: "4px",
                  background: `${STATUS_COLORS[order.status]}06`,
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
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.6)",
                        letterSpacing: "0.05em",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {order.member?.name || "Unknown Member"}
                      {order.tableNumber ? ` · Table ${order.tableNumber}` : ""}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.6rem",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      #{order.id} · {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.6rem",
                      color: STATUS_COLORS[order.status],
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      border: `1px solid ${STATUS_COLORS[order.status]}44`,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "2px",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div style={{ marginBottom: "0.875rem" }}>
                  {order.items?.map((item: any, idx: number) => (
                    <p
                      key={idx}
                      style={{
                        fontFamily: "'EB Garamond', serif",
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.quantity}× {item.name}
                    </p>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => handleAdvance(order.id, order.status)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: `${STATUS_COLORS[NEXT_STATUS[order.status]]}15`,
                        border: `1px solid ${STATUS_COLORS[NEXT_STATUS[order.status]]}44`,
                        borderRadius: "2px",
                        color: STATUS_COLORS[NEXT_STATUS[order.status]],
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.6rem",
                        letterSpacing: "0.1em",
                        cursor: "pointer",
                      }}
                    >
                      MARK {NEXT_STATUS[order.status].toUpperCase()}
                    </button>
                  )}
                  {order.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(order.id)}
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
                      CANCEL
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {active.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: "4px",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              color: "rgba(255,255,255,0.2)",
              fontStyle: "italic",
            }}
          >
            No active orders.
          </p>
        </div>
      )}

      {/* Past orders */}
      {past.length > 0 && (
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
            COMPLETED / CANCELLED
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {past.slice(0, 20).map((order: any) => (
              <div
                key={order.id}
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
                <div>
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {order.member?.name} · {order.items?.map((i: any) => i.name).join(", ")}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.6rem",
                    color: STATUS_COLORS[order.status],
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
