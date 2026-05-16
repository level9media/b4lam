import { trpc } from "@/lib/trpc";

function StatCard({
  label,
  value,
  sub,
  color = "#c8860a",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div
      style={{
        padding: "1.5rem",
        border: `1px solid ${color}22`,
        borderRadius: "4px",
        background: `${color}06`,
      }}
    >
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "0.55rem",
          color: `${color}80`,
          letterSpacing: "0.2em",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "2rem",
          color: color,
          fontWeight: 700,
          textShadow: `0 0 15px ${color}40`,
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.25)",
            marginTop: "0.25rem",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export default function AdminOverview() {
  const { data: stats } = trpc.admin.stats.useQuery();

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.25rem",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.05em",
            marginBottom: "0.25rem",
          }}
        >
          Overview
        </h1>
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
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="TOTAL MEMBERS"
          value={stats?.totalMembers ?? "—"}
          sub="Active memberships"
          color="#c8860a"
        />
        <StatCard
          label="TOKENS SOLD"
          value={stats?.totalTokensSold ?? "—"}
          sub="All time"
          color="#00ffd1"
        />
        <StatCard
          label="TOKENS SPENT"
          value={stats?.totalTokensSpent ?? "—"}
          sub="All time"
          color="#00ffd1"
        />
        <StatCard
          label="OPEN ORDERS"
          value={stats?.openOrders ?? "—"}
          sub="Pending/preparing"
          color="#c8860a"
        />
        <StatCard
          label="PENDING RESERVATIONS"
          value={stats?.pendingReservations ?? "—"}
          sub="Awaiting confirmation"
          color="#c8860a"
        />
        <StatCard
          label="INVITE CODES"
          value={stats?.unusedInvites ?? "—"}
          sub="Available"
          color="#00ffd1"
        />
      </div>

      {/* Recent activity */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
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
            RECENT ORDERS
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {stats.recentOrders.map((order: any) => (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.875rem 1rem",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {order.member?.name || "Unknown"} · Table {order.tableNumber || "—"}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.2)",
                      marginTop: "0.1rem",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.6rem",
                    color:
                      order.status === "completed"
                        ? "#00ffd1"
                        : order.status === "pending"
                        ? "#c8860a"
                        : "rgba(255,255,255,0.4)",
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
