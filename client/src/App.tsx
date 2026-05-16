import { Toaster } from "@/components/ui/sonner";
import { Route, Switch } from "wouter";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "./lib/trpc";

// Public pages
import Landing from "./pages/Landing";
import Register from "./pages/Register";

// Member portal
import PortalHome from "./pages/portal/Home";
import PortalCode from "./pages/portal/Code";
import PortalWallet from "./pages/portal/Wallet";
import PortalMenu from "./pages/portal/Menu";
import PortalReservations from "./pages/portal/Reservations";

// Admin dashboard
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminCodes from "./pages/admin/AdminCodes";
import AdminInvites from "./pages/admin/AdminInvites";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReservations from "./pages/admin/AdminReservations";

// Staff view
import StaffView from "./pages/Staff";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Landing} />
      <Route path="/register" component={Register} />

      {/* Member Portal */}
      <Route path="/portal" component={PortalHome} />
      <Route path="/portal/code" component={PortalCode} />
      <Route path="/portal/wallet" component={PortalWallet} />
      <Route path="/portal/menu" component={PortalMenu} />
      <Route path="/portal/reservations" component={PortalReservations} />

      {/* Admin Dashboard */}
      <Route path="/admin">
        {() => (
          <AdminLayout>
            <AdminOverview />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/members">
        {() => (
          <AdminLayout>
            <AdminMembers />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/menu">
        {() => (
          <AdminLayout>
            <AdminMenu />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/codes">
        {() => (
          <AdminLayout>
            <AdminCodes />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/invites">
        {() => (
          <AdminLayout>
            <AdminInvites />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/orders">
        {() => (
          <AdminLayout>
            <AdminOrders />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/reservations">
        {() => (
          <AdminLayout>
            <AdminReservations />
          </AdminLayout>
        )}
      </Route>

      {/* Staff Bar Queue */}
      <Route path="/staff" component={StaffView} />

      {/* Fallback */}
      <Route>
        {() => (
          <div
            style={{
              minHeight: "100vh",
              background: "#050508",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Cinzel', serif",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.2em",
              fontSize: "0.75rem",
            }}
          >
            NOT FOUND
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#0d0d12",
                border: "1px solid rgba(200,134,10,0.2)",
                color: "rgba(255,255,255,0.8)",
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.9rem",
              },
            }}
          />
          <Router />
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
