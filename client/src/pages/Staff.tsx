import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
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

const NEXT_LABEL: Record<string, string> = {
  pending: "START PREPARING",
  preparing: "MARK READY",
  ready: "COMPLETE",
};

function EmptyCol() {
  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px dashed rgba(255,255,255,0.06)",
        borderRadius: "4px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.15)",
          fontStyle: "italic",
        }}
      >
        Empty
      </p>
    </div>
  );
}

function OrderCard({ order, onAdvance }: { order: any; onAdvance: () => void }) {
  const elapsed = Math.floor((Date.now() - order.createdAt) / 60000);
  const isUrgent = elapsed > 10 && order.status === "pending";

  return (
    <div
      style={{
        padding: "1rem",
        border: `1px solid ${isUrgent ? "rgba(200,80,80,0.4)" : `${STATUS_COLORS[order.status]}22`}`,
        borderRadius: "4px",
        background: isUrgent ? "rgba(200,80,80,0.05)" : `${STATUS_COLORS[order.status]}06`,
      }}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "0.1rem",
          }}
        >
          {order.member?.name || "Member"}
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          {order.tableNumber ? `Table ${order.tableNumber}` : "No table"} · {elapsed}m ago
          {isUrgent && (
            <span style={{ color: "rgba(200,80,80,0.8)", marginLeft: "0.5rem" }}>⚠</span>
          )}
        </p>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        {order.items?.map((item: any, idx: number) => (
          <p
            key={idx}
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.5,
            }}
          >
            {item.quantity}× {item.name}
          </p>
        ))}
      </div>

      {NEXT_STATUS[order.status] && (
        <button
          onClick={onAdvance}
          style={{
            width: "100%",
            padding: "0.5rem",
            background: `${STATUS_COLORS[NEXT_STATUS[order.status]]}15`,
            border: `1px solid ${STATUS_COLORS[NEXT_STATUS[order.status]]}44`,
            borderRadius: "2px",
            color: STATUS_COLORS[NEXT_STATUS[order.status]],
            fontFamily: "'Cinzel', serif",
            fontSize: "0.55rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          {NEXT_LABEL[order.status]}
        </button>
      )}
    </div>
  );
}

export default function StaffView() {
  const [, navigate] = useLocation();
  const { member, isAdmin, isStaff, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!member || (!isStaff && !isAdmin))) {
      navigate("/portal");
    }
  }, [member, isStaff, isAdmin, isLoading]);

  const { data: orders, refetch } = trpc.orders.all.useQuery(undefined, {
    refetchInterval: 8_000,
  });
  const updateStatus = trpc.orders.updateStatus.useMutation();

  async function handleAdvance(orderId: number, currentStatus: string) {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    try {
      await updateStatus.mutateAsync({ orderId, status: next as any });
      refetch();
    } catch (err: any) {
      toast.error("Failed to update order.");
    }
  }

  if (isLoading || !member || (!isStaff && !isAdmin)) return null;

  const active = orders?.filter((o: any) => !["completed", "cancelled"].includes(o.status)) ?? [];
  const readyOrders = active.filter((o: any) => o.status === "ready");
  const preparingOrders = active.filter((o: any) => o.status === "preparing");
  const pendingOrders = active.filter((o: any) => o.status === "pending");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050508",
        padding: "1.5rem",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(0,255,209,0.08)",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "1.25rem",
              color: "#00ffd1",
              letterSpacing: "0.15em",
              textShadow: "0 0 20px rgba(0,255,209,0.4)",
            }}
          >
            B4LAM
          </h1>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.55rem",
              color: "rgba(0,255,209,0.4)",
              letterSpacing: "0.2em",
              marginTop: "0.2rem",
            }}
          >
            BAR QUEUE
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "1.5rem",
                color: "#c8860a",
                fontWeight: 700,
              }}
            >
              {active.length}
            </p>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.5rem",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.15em",
              }}
            >
              ACTIVE
            </p>
          </div>
          <button
            onClick={() => navigate("/portal")}
            style={{
              padding: "0.5rem 1rem",
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "2px",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            PORTAL
          </button>
        </div>
      </div>

      {/* Three-column Kanban */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Pending */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#c8860a",
                boxShadow: "0 0 8px rgba(200,134,10,0.6)",
              }}
            />
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                color: "rgba(200,134,10,0.7)",
                letterSpacing: "0.15em",
              }}
            >
              PENDING ({pendingOrders.length})
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {pendingOrders.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={() => handleAdvance(order.id, order.status)}
              />
            ))}
            {pendingOrders.length === 0 && <EmptyCol />}
          </div>
        </div>

        {/* Preparing */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#00ffd1",
                boxShadow: "0 0 8px rgba(0,255,209,0.6)",
              }}
            />
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                color: "rgba(0,255,209,0.7)",
                letterSpacing: "0.15em",
              }}
            >
              PREPARING ({preparingOrders.length})
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {preparingOrders.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={() => handleAdvance(order.id, order.status)}
              />
            ))}
            {preparingOrders.length === 0 && <EmptyCol />}
          </div>
        </div>

        {/* Ready */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#00ff88",
                boxShadow: "0 0 8px rgba(0,255,136,0.6)",
              }}
            />
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                color: "rgba(0,255,136,0.7)",
                letterSpacing: "0.15em",
              }}
            >
              READY ({readyOrders.length})
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {readyOrders.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={() => handleAdvance(order.id, order.status)}
              />
            ))}
            {readyOrders.length === 0 && <EmptyCol />}
          </div>
        </div>
      </div>
    </div>
  );
}
