import {
  EmitterClientEvent,
  ListenerClientEvent,
} from "@/models/socket";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface ContextValue {
  socket: Socket<ListenerClientEvent,EmitterClientEvent> | null;
}
const SocketContext = createContext<ContextValue | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket<
    ListenerClientEvent,
    EmitterClientEvent
  > | null>(null);

  useEffect(() => {
    const _socket = io();
    console.log("socket", _socket);
    setSocket(_socket);
  }, []);

  useEffect(() => {
    if (!socket) return () => {};

    const reconnect = async (err: Error) => {
      console.log("Error establishing socket", err.message);
    };

    socket?.on("connect_error", reconnect);

    return () => socket?.off("connect_error", reconnect);
  }, []);

  return <SocketContext value={{ socket }}>{children}</SocketContext>;
};
