import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

function StatCard({
  label,
  value,
  sub,
  color = "#00ffd1",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div
      style={{
        padding: "1.25rem",
        border: `1px solid ${color}22`,
        borderRadius: "4px",
        background: `${color}08`,
        flex: 1,
        minWidth: 0,
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
          fontSize: "1.5rem",
          color: color,
          fontWeight: 700,
          textShadow: `0 0 15px ${color}60`,
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.3)",
            marginTop: "0.25rem",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export default function PortalHome() {
  const { member } = useAuth();
  const [, navigate] = useLocation();

  const { data: recentOrders } = trpc.orders.myOrders.useQuery({ limit: 3 });
  const { data: nightlyCode } = trpc.codes.tonight.useQuery();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* Greeting */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.35)",
            fontStyle: "italic",
            marginBottom: "0.25rem",
          }}
        >
          {greeting},
        </p>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.4rem",
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.05em",
          }}
        >
          {member?.name}
        </h2>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <StatCard
          label="TOKENS"
          value={`◈ ${member?.tokenBalance ?? 0}`}
          sub="Available balance"
          color="#00ffd1"
        />
        <StatCard
          label="TONIGHT"
          value={nightlyCode ? "OPEN" : "—"}
          sub={nightlyCode ? "Code available" : "No code yet"}
          color="#c8860a"
        />
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.2em",
            marginBottom: "0.75rem",
          }}
        >
          QUICK ACCESS
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {[
            { label: "Tonight's Code", path: "/portal/code", color: "#c8860a" },
            { label: "Order Drinks", path: "/portal/menu", color: "#00ffd1" },
            { label: "My Wallet", path: "/portal/wallet", color: "#00ffd1" },
            { label: "Reservations", path: "/portal/reservations", color: "#c8860a" },
          ].map(({ label, path, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                padding: "1rem",
                border: `1px solid ${color}22`,
                borderRadius: "4px",
                background: `${color}06`,
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}50`;
                (e.currentTarget as HTMLButtonElement).style.background = `${color}10`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}22`;
                (e.currentTarget as HTMLButtonElement).style.background = `${color}06`;
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      {recentOrders && recentOrders.length > 0 && (
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
            {recentOrders.map((order: any) => (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {order.items?.map((i: any) => i.name).join(", ") || "Order"}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.25)",
                      marginTop: "0.1rem",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.7rem",
                    color:
                      order.status === "completed"
                        ? "#00ffd1"
                        : order.status === "pending"
                        ? "#c8860a"
                        : "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
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
