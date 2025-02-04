"use client";

import { PeerProvider } from "@/context/peer";
import { SocketProvider } from "@/context/socket";
import { StreamProvider } from "@/context/stream";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketProvider>
      <PeerProvider>
      <StreamProvider>{children}</StreamProvider>
      </PeerProvider>
    </SocketProvider>
  );
}
