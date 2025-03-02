import { getVideoSharing } from "@/lib/sharing";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface StreamContextType {
  stream: MediaStream | null;
  hasAccessAudio: boolean;
  hasAccessVideo: boolean;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  toggleFaceMode: () => Promise<void>;
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
  const [hasAccessAudio, setHasAccessAudio] = useState(true);
  const [hasAccessVideo, setHasAccessVideo] = useState(true);

  const facingMode = useRef<"user" | "enviroment">("user");

  useEffect(() => {
    (async function initVideoStream() {
      const stream = await getVideoSharing(facingMode.current);
      if (stream) setStream(stream);
    })();
  }, []);


  useEffect(() => {
    (async function checkPermission() {
      const cameraPermission = await navigator.permissions.query({
        name: "camera",
      });
      const microphonePermission = await navigator.permissions.query({
        name: "microphone",
      });

      setHasAccessVideo(cameraPermission.state === "granted");
      setHasAccessAudio(microphonePermission.state === "granted");

      cameraPermission.addEventListener("change", () => {
        console.log("Camera permission changed to:", cameraPermission.state);
        setHasAccessVideo(cameraPermission.state === "granted");
        getVideoSharing().then((stream) => {
          if (stream) setStream(stream);
        });
      });

      microphonePermission.addEventListener("change", () => {
        setHasAccessAudio(microphonePermission.state === "granted");
        console.log(
          "Microphone permission changed to:",
          microphonePermission.state
        );
      });
    })();
  }, []);

  /**
   * @description only available on mobile
   */
  const toggleFaceMode = async () => {
    facingMode.current = facingMode.current === "user" ? "enviroment" : "user"
    const videoStream = await getVideoSharing(facingMode.current);
    videoStream && setStream(videoStream)
  }

  return (
    <StreamContext
      value={{
        setStream,
        stream,
        hasAccessAudio: hasAccessAudio,
        hasAccessVideo,
        toggleFaceMode
      }}
    >
      {children}
    </StreamContext>
  );
};
