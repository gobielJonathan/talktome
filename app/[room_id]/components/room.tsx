"use client";

import { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
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
import { Team, Teams } from "@/models/data";
import { usePeer } from "@/context/peer";
import RoomLayout from "./room-layout";
import SheetInfo from "./sheets/info";
import SheetMember from "./sheets/member";
import SheetChat from "./sheets/chat";
import useUIListener from "@/hooks/use-ui-listener";
import {
  getMutedValue,
  getUsername,
  getVideoValue,
  setMutedValue,
  setVideoValue,
} from "@/models/preview";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export default function Room() {
  const router = useRouter();
  const roomId = String(useParams()?.room_id);
  const { socket } = useSocket();
  const { myPeerId, peer } = usePeer();

  const { stream } = useStream();
  const shareScreenPeer = useRef<Peer | null>(null);
  const screenStream = useRef<MediaStream | null>(null);

  const { unsubscribe } = useUIListener();
  const [time, setTime] = useState(new Date());
  const [users, setUsers] = useState<Record<string, MediaConnection>>({});
  const [teams, setTeams] = useState<Teams>({});

  useEffect(() => {
    window.addEventListener("unload", handleUserLeave);
    return () => window.removeEventListener("unload", handleUserLeave);
  }, []);

  useEffect(() => {
    if (!peer || !stream || !socket) return () => {};

    const handleUserConnected = (
      userId: string,
      additionalData?: Record<string, unknown>
    ) => {
      const call = peer.call(userId, stream, {
        metadata: {
          username: getUsername(),
          muted: getMutedValue(),
          video: getVideoValue(),
        },
      });

      /**
       * @description if the user is sharing screen, share the screen to the new user
       */
      if (shareScreenPeer.current && screenStream.current) {
        const shareScreenName = getUsername() + " Screen";

        shareScreenPeer.current.call(userId, screenStream.current, {
          metadata: {
            username: shareScreenName,
            muted: false,
            video: true,
            pinned : true
          },
        });
      }

      const handleCallStream = (remoteStream: MediaStream) => {
        setTeams((prev) => ({
          ...prev,
          [userId]: {
            url: remoteStream,
            peerId: userId,
            muted: Boolean(additionalData?.muted ?? getMutedValue()),
            video: Boolean(additionalData?.video ?? getVideoValue()),
            username: String(additionalData?.username ?? "Jhon Doe"),
            pinned: false,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [userId]: call,
        }));
      };

      call.on("stream", handleCallStream);
      unsubscribe(() => {
        call.off("stream", handleCallStream);
      });
    };

    socket.on("user-connected", handleUserConnected);
    return () => socket.off("user-connected", handleUserConnected);
  }, [peer, stream, socket]);

  useEffect(() => {
    if (!stream || !peer) return () => {};

    peer.on("call", (call) => {
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
            pinned: call.metadata.pinned || false,
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
        muted: getMutedValue(),
        video: getVideoValue(),
        username: getUsername(),
        pinned: false,
      },
    }));
  }, [myPeerId, stream]);

  useEffect(() => {
    if (!socket) return () => {};

    const handleUserLeave = (userId: string) => {
      setUsers((_users) => {
        if (!_users[userId]) return _users;
        _users[userId].close();
        const { [userId]: deletedUser, ...withoutUserLeave } = users;

        return withoutUserLeave;
      });

      setTeams((_teams) => {
        if (!_teams[userId]) return _teams;
        const { [userId]: deletedPlayer, ...withoutPlayerLeave } = _teams;
        return withoutPlayerLeave;
      });
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
  }, [socket]);

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
    if (!myPeerId || !socket) return;

    setTeams((prev) => {
      const _prev = cloneDeep(prev);
      _prev[myPeerId].muted = !_prev[myPeerId].muted;
      setMutedValue(_prev[myPeerId].muted);
      return _prev;
    });

    socket.emit("user-toggle-audio", myPeerId, roomId);
  };

  const toggleVideo = () => {
    if (!myPeerId || !socket) return;

    setTeams((prev) => {
      const _prev = cloneDeep(prev);
      _prev[myPeerId].video = !_prev[myPeerId].video;
      setVideoValue(_prev[myPeerId].video);
      return _prev;
    });
    socket.emit("user-toggle-video", myPeerId, roomId);
  };

  const handleUserLeave = () => {
    if (!myPeerId || !socket || !peer) return;

    socket.emit("user-leave", myPeerId, roomId);
    peer.disconnect();

    router.push("/");
  };

  const handleUserUnshare = () => {
    if (!shareScreenPeer.current || !screenStream.current || !socket) return;

    const shareScreePeerId = shareScreenPeer.current.id;
    setTeams((prev) => {
      const { [shareScreePeerId]: deletedShareScreen, ...withoutShareScreen } =
        prev;
      return withoutShareScreen;
    });
    screenStream.current.getTracks().forEach((track) => track.stop());
    screenStream.current = null;
    shareScreenPeer.current?.destroy();
    socket.emit("user-leave", shareScreePeerId, roomId);
  };

  const handleShareScreen = async () => {
    if (!myPeerId || !socket) return;

    if (screenStream.current) return;

    const _screenStream = await getScreenSharing();
    if (!_screenStream) return;
    screenStream.current = _screenStream;

    const shareScreenName = getUsername() + " Screen";

    const shareScreePeerId = `${myPeerId}-screen`;
    shareScreenPeer.current = new Peer(shareScreePeerId);
    shareScreenPeer.current.on("open", () => {
      setTeams((prev) => ({
        ...prev,
        [shareScreePeerId]: {
          url: _screenStream,
          peerId: shareScreePeerId,
          muted: true,
          video: true,
          username: shareScreenName,
          pinned: true,
        },
      }));

      Object.keys(teams).forEach((peer) => {
        shareScreenPeer.current?.call(peer, _screenStream, {
          metadata: {
            username: shareScreenName,
            muted: false,
            video: true,
            pinned: true,
          },
        });
      });
    });

    _screenStream.getTracks().forEach((track) => {
      track.addEventListener("ended", handleUserUnshare);
    })
    
    unsubscribe(() => {
      _screenStream.getTracks().forEach((track) => {
      track.removeEventListener("ended", handleUserUnshare);
      })
    });
  };

  const onToggleUserPin = (team: Team) => {
    if (!socket) return;

    setTeams((prev) => {
      const _prev = cloneDeep(prev);
      _prev[team.peerId].pinned = !_prev[team.peerId].pinned;
      return _prev;
    });
    socket.emit("user-toggle-highlight", team.peerId, roomId);
  };

  //get the player config ( playing and muted )
  const { muted = getMutedValue(), video = getVideoValue() } =
    teams[myPeerId ?? ""] || {};

  const isCurrentUserShareScreen = Boolean(teams[`${myPeerId}-screen`]);

  return (
    <div className="bg-gray-900 flex flex-col h-screen">
      <header className="inline-flex lg:hidden items-center py-2 px-6">
        <p className="text-white font-semibold">{roomId}</p>
      </header>

      <div className="flex-1">
        <RoomLayout teams={teams} />
      </div>

      <div className="grid grid-cols-12 py-4 px-6 shrink-0">
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
            className={clsx("rounded-full hover:bg-gray-600 bg-gray-700 p-2", {
              "!bg-blue-500 !hover:bg-blue-400": isCurrentUserShareScreen,
            })}
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
          <SheetMember
            teams={Object.values(teams)}
            onToggleUserPin={onToggleUserPin}
          >
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
