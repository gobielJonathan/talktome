"use client";

import { useMemo, useState } from "react";
import { PeerProvider } from "@/context/peer";
import dynamic from "next/dynamic";

const  Preview = dynamic(() => import("./components/preview"), {ssr: false});
const  Room = dynamic(() => import("./components/room"), {ssr: false});

export default function RoomClient() {
  const [step, setStep] = useState(1);

  const steps = useMemo(
    () => ({
      1: <Preview onNextStep={() => setStep((prev) => prev + 1)} />,
      2: <PeerProvider>
        <Room />
      </PeerProvider>,
    }),
    [setStep]
  );

  return <>{steps[step]}</>;
}
