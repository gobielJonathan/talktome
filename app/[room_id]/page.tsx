"use client";

import { useMemo, useState } from "react";
import Preview from "./components/preview";
import Room from "./components/room";
import { PeerProvider } from "@/context/peer";

export default function Page() {
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
