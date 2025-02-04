import Image from "next/image";
import { ReactNode, useState } from "react";
import { Mic, MicOff, EllipsisVertical, Pin, PinOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Team } from "@/models/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocket } from "@/context/socket";
import { useSearchParams } from "next/navigation";

export default function SheetMember(props: {
  children: ReactNode;
  teams: Team[];
}) {
  const roomId = String(useSearchParams()?.room_id);
  const { socket } = useSocket();

  const [teams, setTeams] = useState(props.teams);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeams(
      props.teams.filter((team) => team.username.includes(e.target.value))
    );
  };

  const onPin = (team: Team) => {
    socket?.emit("user-toggle-highlight", team.peerId, roomId);
    console.log(team.peerId, "pinned");
  };

  return (
    <Sheet>
      <SheetTrigger>{props.children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>People</SheetTitle>
          <Input placeholder="search for people" onChange={onSearch} />

            <p className="text-gray-600 mt-10">IN MEETING</p>

            <div className="flex flex-col gap-y-4 mt-4">
              {teams.length === 0 && <p>No results</p>}
              {teams.map((team) => (
                <div className="flex w-full gap-x-3 items-center">
                  <div>
                    <Image
                      alt="user avatar"
                      src={`https://avatar.iran.liara.run/username?username=${team.username}`}
                      width={32}
                      height={32}
                      loading="eager"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg">Jonathan</p>
                  </div>
                  <div className="inline-flex items-center gap-x-4">
                    {team.muted ? <MicOff /> : <Mic />}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="hover:cursor-pointer"
                          onClick={() => onPin(team)}
                        >
                          <Pin /> <span className="ml-2">Pin to screen</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
