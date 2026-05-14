import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PageTransitionProvider } from "./contexts/PageTransitionContext";
import SigilOverlay from "./components/SigilOverlay";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Artists from "./pages/Artists";
import Experience from "./pages/Experience";
import About from "./pages/About";
import Events from "./pages/Events";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/menu"} component={Menu} />
      <Route path={"/artists"} component={Artists} />
      <Route path={"/experience"} component={Experience} />
      <Route path={"/about"} component={About} />
      <Route path={"/events"} component={Events} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <PageTransitionProvider>
          <TooltipProvider>
            <Toaster />
            {/* Global neon sigil transition overlay — renders above everything */}
            <SigilOverlay />
            <Router />
          </TooltipProvider>
        </PageTransitionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
