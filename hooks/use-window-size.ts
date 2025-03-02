import { useState, useEffect } from "react";

const breakpoints = {
  sm: "(max-width: 640px)",
  md: "(max-width: 768px)",
  lg: "(max-width: 1024px)",
  xl: "(max-width: 1280px)",
  "2xl": "(max-width: 1536px)",
};

const getActiveBreakpoint = () => {
  for (const [key, query] of Object.entries(breakpoints)) {
    if (window.matchMedia(query).matches) {
      return key;
    }
  }
  return null;
};

export function useWindowSize() {

  const [activeBreakpoint, setActiveBreakpoint] = useState(getActiveBreakpoint);

  useEffect(() => {
    const handler = () => setActiveBreakpoint(getActiveBreakpoint());

    const mediaQueries = Object.values(breakpoints).map((query) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", handler);
      return mql;
    });

    return () => {
      mediaQueries.forEach((mql) => mql.removeEventListener("change", handler));
    };
  }, []);

  return activeBreakpoint;
}
