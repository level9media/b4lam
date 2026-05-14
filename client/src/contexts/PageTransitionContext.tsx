/**
 * BLINDSIDE LOUNGE — Page Transition Context
 * Controls the neon sigil overlay that plays on page navigation.
 */

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { useLocation } from "wouter";

type TransitionState = "idle" | "entering" | "holding" | "leaving";

interface PageTransitionContextType {
  navigateTo: (path: string) => void;
  transitionState: TransitionState;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  navigateTo: () => {},
  transitionState: "idle",
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const [transitionState, setTransitionState] = useState<TransitionState>("idle");
  const pendingPath = useRef<string | null>(null);

  const navigateTo = useCallback((path: string) => {
    if (transitionState !== "idle") return;
    pendingPath.current = path;

    // Phase 1: Overlay enters (sigil scales in, black covers screen) — 600ms
    setTransitionState("entering");

    setTimeout(() => {
      // Phase 2: Hold at full cover while route changes — 300ms
      setTransitionState("holding");
      if (pendingPath.current) {
        navigate(pendingPath.current);
        window.scrollTo({ top: 0 });
      }

      setTimeout(() => {
        // Phase 3: Overlay leaves (sigil fades, black recedes) — 700ms
        setTransitionState("leaving");

        setTimeout(() => {
          setTransitionState("idle");
        }, 700);
      }, 300);
    }, 600);
  }, [transitionState, navigate]);

  return (
    <PageTransitionContext.Provider value={{ navigateTo, transitionState }}>
      {children}
    </PageTransitionContext.Provider>
  );
}
