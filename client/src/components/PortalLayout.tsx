import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Home,
  Wine,
  Wallet,
  Calendar,
  Key,
  LogOut,
  Shield,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { path: "/portal", label: "Home", icon: Home },
  { path: "/portal/menu", label: "Menu", icon: Wine },
  { path: "/portal/wallet", label: "Wallet", icon: Wallet },
  { path: "/portal/code", label: "Tonight", icon: Key },
  { path: "/portal/reservations", label: "Reserve", icon: Calendar },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { member, isAdmin, isStaff } = useAuth();
  const logout = trpc.auth.logout.useMutation();

  async function handleLogout() {
    await logout.mutateAsync();
    navigate("/");
    toast.success("Goodbye.");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050508",
        display: "flex",
        flexDirection: "column",
        maxWidth: "480px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "1rem 1.5rem 0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0,255,209,0.08)",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "1rem",
              color: "#00ffd1",
              letterSpacing: "0.15em",
              textShadow: "0 0 15px rgba(0,255,209,0.4)",
              margin: 0,
            }}
          >
            B4LAM
          </h1>
          {member && (
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
                margin: "0.1rem 0 0",
                fontStyle: "italic",
              }}
            >
              {member.name}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Token balance */}
          {member && (
            <div className="token-badge">
              ◈ {member.tokenBalance}
            </div>
          )}

          {/* Admin link */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              style={{
                background: "none",
                border: "none",
                color: "rgba(200,134,10,0.7)",
                cursor: "pointer",
                padding: "0.25rem",
              }}
              title="Admin"
            >
              <Shield size={16} />
            </button>
          )}

          {/* Staff link */}
          {isStaff && !isAdmin && (
            <button
              onClick={() => navigate("/staff")}
              style={{
                background: "none",
                border: "none",
                color: "rgba(200,134,10,0.7)",
                cursor: "pointer",
                padding: "0.25rem",
              }}
              title="Order Queue"
            >
              <ClipboardList size={16} />
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.25)",
              cursor: "pointer",
              padding: "0.25rem",
            }}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "5rem" }}>
        {children}
      </div>

      {/* Bottom navigation */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "480px",
          background: "rgba(5,5,8,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(0,255,209,0.1)",
          display: "flex",
          justifyContent: "space-around",
          padding: "0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom))",
          zIndex: 100,
        }}
      >
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location === path || (path !== "/portal" && location.startsWith(path));
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                background: "none",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                padding: "0.4rem 0.75rem",
                cursor: "pointer",
                color: isActive ? "#00ffd1" : "rgba(255,255,255,0.3)",
                transition: "color 0.2s ease",
                filter: isActive ? "drop-shadow(0 0 6px rgba(0,255,209,0.5))" : "none",
              }}
            >
              <Icon size={20} />
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                }}
              >
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
