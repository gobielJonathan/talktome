import {
  USER_TOGGLE_AUDIO_EVENT,
  JOIN_ROOM_EVENT,
  USER_CONNECTED_EVENT,
  USER_LEAVE_EVENT,
  USER_SEND_CHAT_EVENT,
  USER_TOGGLE_HIGHLIGHT_EVENT,
  USER_TOGGLE_VIDEO_EVENT,
} from "@/models/socket";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

export interface ListenerClientEvent {
  [USER_TOGGLE_AUDIO_EVENT]: (userId: string) => void;
  [USER_LEAVE_EVENT]: (userId: string) => void;
  [USER_TOGGLE_VIDEO_EVENT]: (userId: string) => void;
  [USER_CONNECTED_EVENT]: (
    userId: string,
    additionalData?: Record<string, string>
  ) => void;
  [USER_TOGGLE_HIGHLIGHT_EVENT]: (userId: string) => void;
  [USER_SEND_CHAT_EVENT]: (userId: string, message: string) => void;
}

export interface EmitterClientEvent {
  [USER_TOGGLE_AUDIO_EVENT]: (userId: string, roomId: string) => void;
  [USER_TOGGLE_VIDEO_EVENT]: (userId: string, roomId: string) => void;
  [USER_LEAVE_EVENT]: (userId: string, roomId: string) => void;
  [JOIN_ROOM_EVENT]: (
    roomId: string,
    userId: string,
    additionalData?: Record<string, string>
  ) => void;
  [USER_TOGGLE_HIGHLIGHT_EVENT]: (userId: string, roomId: string) => void;
  [USER_SEND_CHAT_EVENT]: (
    userId: string,
    roomId: string,
    message: string
  ) => void;
}

interface ContextValue {
  socket: Socket<ListenerClientEvent, EmitterClientEvent> | null;
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
    setSocket(_socket);
  }, []);

  useEffect(() => {
    if (!socket) return () => {};

    const reconnect = async (err: Error) => {
      console.log("Error establishing socket", err.message);
    };

    socket.on("connect_error", reconnect);

    return () => socket.off("connect_error", reconnect);
  }, [socket]);

  return <SocketContext value={{ socket }}>{children}</SocketContext>;
};
