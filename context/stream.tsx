import { getVideoSharing } from "@/lib/sharing";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface StreamContextType {
  stream: MediaStream | null;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
};

export const StreamProvider = ({ children }: { children: ReactNode }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    (async function initVideoStream() {
      const stream = await getVideoSharing();
      if (stream) setStream(stream);
    })();
  }, []);

  return (
    <StreamContext value={{ setStream, stream }}>{children}</StreamContext>
  );
};
