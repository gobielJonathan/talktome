import { sendGTMEvent } from "@next/third-parties/google";

declare global {
  interface Window {
    scheduler: any;
  }
}

const pushInBackground = (track: () => void) => {
  window.scheduler = window.scheduler ?? {
    postTask: (callback: () => void) => setTimeout(callback, 0),
  };

  if ("scheduler" in window) {
    window.scheduler.postTask(track, { priority: "background" });
  }
};

export const send = (record: Record<string, string>) => {
  pushInBackground(() => {
    if(process.env.NODE_ENV === "development") console.log("record send", record)
    sendGTMEvent(record)
  });
};
