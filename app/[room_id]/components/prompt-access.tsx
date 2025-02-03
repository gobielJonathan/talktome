import { Button } from "@/components/ui/button";
import { useStream } from "@/context/stream";

export default function PromptAccess() {
  const { hasAccessAudio, hasAccessVideo, setStream } = useStream();

  const enableAudioVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
    } catch (error) {
        console.log('error', error)
    }
  };

  const enableVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, 
      });
      setStream(stream);
    } catch (error) {}
  };

  if (!hasAccessAudio || !hasAccessVideo) {
    return (
      <div className="flex flex-col h-full justify-center items-center">
        <h1 className="text-xl text-center font-bold">
          Do you want people to see and hear you in the meeting?
        </h1>
        <Button className="mt-2" onClick={enableAudioVideo}>Allow microphone and camera</Button>
      </div>
    );
  }

  if (!hasAccessVideo) {
    return (
      <div className="flex flex-col h-full justify-center items-center">
        <h1 className="text-xl text-center font-bold">
          Do you want people to see you in the meeting?
        </h1>
        <Button className="mt-2" onClick={enableVideo}>Allow microphone and camera</Button>
      </div>
    );
  }

  return null;
}
