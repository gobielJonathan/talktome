"use client";

import { useEffect, useState } from "react";
import { MediaConnection } from "peerjs";
import { useParams, useRouter } from "next/navigation";
import {
  Info,
  CircleUser,
  MessageCircle,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  PhoneOff,
} from "lucide-react";
import cloneDeep from "lodash/cloneDeep";
import dayjs from "dayjs";

import { getScreenSharing } from "@/lib/sharing";
import { useSocket } from "@/context/socket";
import { useStream } from "@/context/stream";
import { Teams } from "@/models/data";
import {
  CONFIG_AUDIO_ENABLED,
  CONFIG_NAME,
  CONFIG_VIDEO_ENABLED,
} from "@/models/storage";
import { usePeer } from "@/context/peer";
import RoomLayout from "./room-layout";
import SheetInfo from "./sheets/info";
import SheetMember from "./sheets/member";
import SheetChat from "./sheets/chat";

export default function Room() {
  const router = useRouter();
  const roomId = String(useParams()?.room_id);
  const { socket } = useSocket();
  const { myPeerId, peer } = usePeer();
  const { stream, setStream } = useStream();

  const [time, setTime] = useState(new Date());

  const [users, setUsers] = useState<Record<string, MediaConnection>>({});
  const [teams, setTeams] = useState<Teams>({});

  useEffect(() => {
    if (!peer || !stream || !socket) return () => {};

    const handleUserConnected = (
      userId: string,
      additionalData?: Record<string, string>
    ) => {
      const call = peer.call(userId, stream, {
        metadata: {
          username: localStorage.getItem(CONFIG_NAME) ?? "Jhon Doe",
          muted: localStorage.getItem(CONFIG_AUDIO_ENABLED) === "true",
          video: localStorage.getItem(CONFIG_VIDEO_ENABLED) === "true",
        },
      });

      call.on("stream", (remoteStream) => {
        console.log("stream", remoteStream);
        setTeams((prev) => ({
          ...prev,
          [userId]: {
            url: remoteStream,
            peerId: userId,
            muted: localStorage.getItem(CONFIG_AUDIO_ENABLED) === "false",
            video: localStorage.getItem(CONFIG_VIDEO_ENABLED) === "false",
            username: additionalData?.username ?? "Jhon Doe",
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [userId]: call,
        }));
      });
    };

    socket.on("user-connected", handleUserConnected);
    return () => socket.off("user-connected", handleUserConnected);
  }, [peer, stream, socket]);

  useEffect(() => {
    if (!stream || !peer) return () => {};

    peer.on("call", (call) => {
      console.log("call ", call.metadata);
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        setTeams((prev) => ({
          ...prev,
          [call.peer]: {
            url: remoteStream,
            peerId: call.peer,
            muted: call.metadata.muted,
            video: call.metadata.video,
            username: call.metadata.username,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [call.peer]: call,
        }));
      });
    });
  }, [stream, peer]);

  //set local player stream
  useEffect(() => {
    if (!myPeerId || !stream) return;

    setTeams((prev) => ({
      ...prev,
      [myPeerId]: {
        url: stream,
        peerId: myPeerId,
        muted: localStorage.getItem(CONFIG_AUDIO_ENABLED) === "false",
        video: localStorage.getItem(CONFIG_VIDEO_ENABLED) === "false",
        username: localStorage.getItem(CONFIG_NAME) ?? "Jhon Doe",
      },
    }));
  }, [myPeerId, stream]);

  useEffect(() => {
    if (!socket) return () => {};

    const handleUserLeave = (userId: string) => {
      if (!users[userId]) return;

      users[userId].close();
      const { [userId]: deletedUser, ...withoutUserLeave } = users;
      setUsers(withoutUserLeave);

      const { [userId]: deletedPlayer, ...withoutPlayerLeave } = teams;
      setTeams(withoutPlayerLeave);
    };

    const handleUserToggleAudio = (userId: string) => {
      setTeams((prev) => {
        const _prev = cloneDeep(prev);
        _prev[userId].muted = !_prev[userId].muted;
        return _prev;
      });
    };

    const handleUserToggleVideo = (userId: string) => {
      setTeams((prev) => {
        const _prev = cloneDeep(prev);
        _prev[userId].video = !_prev[userId].video;
        return _prev;
      });
    };

    const handleUserHighlight = (userId: string) => {
      setTeams((prev) => {
        const _prev = cloneDeep(prev);
        _prev[userId].pinned = !_prev[userId].pinned;
        return _prev;
      });
    };

    socket.on("user-leave", handleUserLeave);
    socket.on("user-toggle-audio", handleUserToggleAudio);
    socket.on("user-toggle-video", handleUserToggleVideo);
    socket.on("user-toggle-highlight", handleUserHighlight);

    return () => {
      socket.off("user-leave", handleUserLeave);
      socket.off("user-toggle-audio", handleUserToggleAudio);
      socket.off("user-toggle-video", handleUserToggleVideo);
      socket.off("user-toggle-highlight", handleUserHighlight);
    };
  }, [socket, users, teams]);

  //handle time
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const toggleAudio = () => {
    if (!myPeerId) return;

    setTeams((prev) => {
      const _prev = cloneDeep(prev);
      _prev[myPeerId].muted = !_prev[myPeerId].muted;
      return _prev;
    });

    socket?.emit("user-toggle-audio", myPeerId, roomId);
  };

  const toggleVideo = () => {
    if (!myPeerId) return;

    setTeams((prev) => {
      const _prev = cloneDeep(prev);
      _prev[myPeerId].video = !_prev[myPeerId].video;
      return _prev;
    });
    socket?.emit("user-toggle-video", myPeerId, roomId);
  };

  const handleUserLeave = () => {
    if (!myPeerId || !socket || !peer) return;

    socket.emit("user-leave", myPeerId, roomId);
    peer.disconnect();

    router.push("/");
  };

  const handleShareScreen = async () => {
    const screenStream = await getScreenSharing();
    if (screenStream) {
      setStream(screenStream);
    }
  };

  //get the player config ( playing and muted )
  const { muted, video } = teams[myPeerId ?? ""] || {};

  return (
    <div className="bg-gray-900 flex flex-col h-full flex-wrap">
      <header className="inline-flex lg:hidden items-center py-2 px-6">
        <p className="text-white font-semibold">{roomId}</p>
      </header>

      <RoomLayout teams={teams} />

      <div className="grid grid-cols-12 py-4 px-6">
        <div className="col-span-3 hidden xl:inline-flex items-center">
          <p className="text-white font-semibold">
            {dayjs(time).format("HH:mm")}
          </p>
          <span className="text-white mx-3"> | </span>
          <p className="text-white font-semibold">{roomId}</p>
        </div>
        <div className="col-span-12 xl:col-span-6 inline-flex gap-x-2 justify-center">
          <button
            className="rounded-full hover:bg-gray-600 bg-gray-700 p-2"
            onClick={toggleAudio}
          >
            {muted ? <MicOff color="white" /> : <Mic color="white" />}
          </button>
          <button
            className="rounded-full hover:bg-gray-600 bg-gray-700 p-2"
            onClick={toggleVideo}
          >
            {video ? <Camera color="white" /> : <CameraOff color="white" />}
          </button>
          <button
            className="rounded-full hover:bg-gray-600 bg-gray-700 p-2"
            onClick={handleShareScreen}
          >
            <Monitor color="white" />
          </button>

          <button
            className="rounded-full hover:bg-red-600 bg-red-900 p-2"
            onClick={handleUserLeave}
          >
            <PhoneOff color="white" />
          </button>
        </div>
        <div className="col-span-3 hidden xl:inline-flex gap-x-2 justify-end">
          <SheetInfo>
            <Info color="white" />
          </SheetInfo>
          <SheetMember teams={Object.values(teams)}>
            <CircleUser color="white" />
          </SheetMember>
          <SheetChat teams={teams}>
            <MessageCircle color="white" />
          </SheetChat>
        </div>
      </div>
    </div>
  );
}
