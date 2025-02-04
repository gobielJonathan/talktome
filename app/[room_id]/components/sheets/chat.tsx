import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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

export default function SheetChat(props: {
  children: ReactNode;
  teams: Teams;
}) {
  const roomId = String(useParams()?.room_id);
  const { myPeerId } = usePeer();
  const [chats, setChats] = useState<{ username: string; message: string }[]>(
    []
  );
  const [text, setText] = useState("");

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return () => {};

    const handleChat = (userId: string, message: string) => {
      console.log("user-send-chat", userId, message);
      setChats((prevChats) => [
        ...prevChats,
        { username: props.teams[userId].username, message },
      ]);
    };
    socket.on("user-send-chat", handleChat);
    return () => {
      socket.off("user-send-chat", handleChat);
    };
  }, [socket]);

  const onSendChat = () => {
    if (text && myPeerId && socket) {
        setChats((prevChats) => [
            ...prevChats,
            { username: localStorage.getItem(CONFIG_NAME) ?? "jhon doe", message: text },
          ]);

      socket.emit("user-send-chat", myPeerId, roomId, text);
      setText("");
    }
  };

  return (
    <Sheet>
      <SheetTrigger>{props.children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>In-call messages</SheetTitle>
          <div className="h-full overflow-y-auto">
            {chats.map((chat, index) => (
              <div key={index}>
                <b className="font-semibold">{chat.username}</b>
                <p>{chat.message}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl flex items-center bg-gray-100">
            <div className="flex-1">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border-none shadow-none"
                placeholder="Send a message to everyone"
              />
            </div>
            <button onClick={onSendChat} className="mr-2">
              <SendHorizonal className="text-gray-400" />
            </button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
