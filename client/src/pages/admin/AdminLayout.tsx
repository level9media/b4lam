import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import {
  Users,
  UtensilsCrossed,
  Tag,
  Key,
  ClipboardList,
  Calendar,
  ArrowLeft,
  BarChart3,
} from "lucide-react";

const adminNav = [
  { path: "/admin", label: "Overview", icon: BarChart3 },
  { path: "/admin/members", label: "Members", icon: Users },
  { path: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { path: "/admin/codes", label: "Codes", icon: Key },
  { path: "/admin/orders", label: "Orders", icon: ClipboardList },
  { path: "/admin/reservations", label: "Reservations", icon: Calendar },
  { path: "/admin/invites", label: "Invites", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { member, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!member || !isAdmin)) {
      navigate("/portal");
    }
  }, [member, isAdmin, isLoading]);

  if (isLoading || !member || !isAdmin) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050508",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          flexShrink: 0,
          background: "#0a0a10",
          borderRight: "1px solid rgba(200,134,10,0.1)",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 0",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 1.25rem 1.5rem" }}>
          <p
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "0.85rem",
              color: "#f0a820",
              letterSpacing: "0.15em",
              textShadow: "0 0 15px rgba(200,134,10,0.4)",
            }}
          >
            B4LAM
          </p>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.5rem",
              color: "rgba(200,134,10,0.4)",
              letterSpacing: "0.2em",
              marginTop: "0.2rem",
            }}
          >
            ADMIN CONSOLE
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {adminNav.map(({ path, label, icon: Icon }) => {
            const isActive = location === path || (path !== "/admin" && location.startsWith(path));
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  width: "100%",
                  padding: "0.625rem 1.25rem",
                  background: isActive ? "rgba(200,134,10,0.08)" : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${isActive ? "#c8860a" : "transparent"}`,
                  color: isActive ? "#f0a820" : "rgba(255,255,255,0.35)",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Back to portal */}
        <button
          onClick={() => navigate("/portal")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.25rem",
            background: "none",
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.2)",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={12} />
          Member Portal
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
        {children}
      </div>
    </div>
  );
}
