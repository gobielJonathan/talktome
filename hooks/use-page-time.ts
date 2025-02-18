import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef } from "react";

export default function usePageTime(props: {
  onEnter: () => void;
  onLeave: () => void;
}) {
  const start = useRef(new Date());

  /**
   * @returns {number} duration in minutes
   */
  const getDuration = useCallback(() => {
    const end = new Date();
    return dayjs(end).diff(start.current, "minutes");
  }, []);

  useEffect(() => {
    props.onEnter();

    function handleLeave() {
      props.onLeave();
    }

    window.addEventListener("unload", handleLeave);

    return () => window.removeEventListener("unload", handleLeave);
  }, []);

  return useMemo(() => ({ getDuration }), [getDuration]);
}
