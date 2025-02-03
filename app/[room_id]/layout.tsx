"use client";

import { SocketProvider } from "@/context/socket";
import { StreamProvider } from "@/context/stream";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketProvider>
      <StreamProvider>{children}</StreamProvider>
    </SocketProvider>
  );
}
