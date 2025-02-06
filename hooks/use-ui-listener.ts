import { useEffect, useMemo, useRef } from "react";

export default function useUIListener() {
  const unsubs = useRef<(() => void)[]>([]);

  useEffect(() => {
    return () => {
      unsubs.current.forEach((fn) => fn());
    };
  }, []);

  return useMemo(() => {
    return {
      unsubscribe(fn: () => void) {
        unsubs.current.push(fn);
      },
    };
  }, []);
}
