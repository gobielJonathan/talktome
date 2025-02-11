import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSocket } from "@/context/socket";
import { Teams } from "@/models/data";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { usePeer } from "@/context/peer";
import { CONFIG_NAME } from "@/models/storage";
import { getUsername } from "@/models/preview";
import dayjs from "dayjs";
import { flushSync } from "react-dom";

export default function SheetChat(props: {
  children: ReactNode;
  teams: Teams;
}) {
  const roomId = String(useParams()?.room_id);
  const { myPeerId } = usePeer();
  const [chats, setChats] = useState<
    { username: string; message: string; time: Date }[]
  >([]);
  const listChatRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return () => {};

    const handleChat = (userId: string, message: string) => {
      flushSync(() => {
        setChats((prevChats) => [
          ...prevChats,
          { username: props.teams[userId].username, message, time: new Date() },
        ]);
      });
      listChatRef.current.scrollTop = listChatRef.current.scrollHeight;
    };
    socket.on("user-send-chat", handleChat);
    return () => {
      socket.off("user-send-chat", handleChat);
    };
  }, [socket, props.teams]);

  const onSendChat = () => {
    if (text && myPeerId && socket) {
      flushSync(() => {
        setChats((prevChats) => [
          ...prevChats,
          {
            username: "You",
            message: text,
            time: new Date(),
          },
        ]);
      });

      listChatRef.current.scrollTop = listChatRef.current.scrollHeight;

      socket.emit("user-send-chat", myPeerId, roomId, text);
      setText("");
    }
  };

  return (
    <Sheet>
      <SheetTrigger>{props.children}</SheetTrigger>
      <SheetContent className="h-full flex flex-col">
        <SheetHeader>
          <SheetTitle>In-call messages</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col flex-1">
          <div
            ref={listChatRef}
            className="flex-1 basis-auto h-0 overflow-y-auto mb-4"
          >
            {chats.map((chat, index) => (
              <div key={index} className="mb-2">
                <span>
                  <b className="font-semibold">{chat.username}</b>{" "}
                  <span className="ml-1 text-xs">
                    {dayjs(chat.time).format("HH:mm:ss")}
                  </span>
                </span>
                <p>{chat.message}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl flex items-center bg-gray-100">
            <div className="flex-1">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  e.key === "Enter" && onSendChat();
                }}
                className="border-none shadow-none"
                placeholder="Send a message to everyone"
              />
            </div>
            <button onClick={onSendChat} className="mr-2">
              <SendHorizonal className="text-gray-400" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
