import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSocket } from "./socket";
import Peer from "peerjs";
import { useParams } from "next/navigation";
import { getMutedValue, getUsername, getVideoValue } from "@/models/preview";
import { send } from "@/lib/tracker";

interface PeerContext {
  peer?: Peer;
  myPeerId?: string;
}

const PeerContext = createContext<PeerContext | undefined>(undefined);

export const usePeer = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }
  return context;
};

export const PeerProvider = ({ children }: { children: ReactNode }) => {
  const roomId = String(useParams()?.room_id);
  const { socket } = useSocket();
  const isAlreadyInit = useRef(false);
  const [myPeerId, setMyPeerId] = useState<string | undefined>(undefined);
  const [peer, setPeer] = useState<Peer | undefined>(undefined);

  //handle peer connection
  useEffect(() => {
    if (isAlreadyInit.current || !socket) return;

    isAlreadyInit.current = true;

    const _peer = new Peer();
    _peer.on("open", (id) => {
      socket?.emit("join-room", roomId, id, {
        username: getUsername(),
        muted: getMutedValue(),
        video: getVideoValue(),
      });
      setMyPeerId(id);

      send({ event: "join_room", peer_id: id, room_id: roomId });
    });
    setPeer(_peer);
  }, [socket]);

  return <PeerContext value={{ peer, myPeerId }}>{children}</PeerContext>;
};
