import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { Mic, MicOff, EllipsisVertical, Pin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
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
import { MAX_TEAMS_HIGHLIGHT } from "@/models/preview";

interface Props {
  children: ReactNode;
  teams: Team[];
  onToggleUserPin: (team: Team) => void;
}

export default function SheetMember(props: Props) {
  const [teams, setTeams] = useState(props.teams);

  useEffect(() => {
    setTeams(props.teams);
  }, [props.teams]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeams(
      props.teams.filter((team) => team.username.includes(e.target.value))
    );
  };

  const onPin = (team: Team) => {
    const pinnedTeams = props.teams.filter((t) => t.pinned);
    if (pinnedTeams.length >= MAX_TEAMS_HIGHLIGHT) {
      console.log("max pinned teams reached");
      return;
    }

    props.onToggleUserPin(team);
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
              <div
                key={team.peerId}
                className="flex w-full gap-x-3 items-center"
              >
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
                  <p className="text-lg capitalize">{team.username}</p>
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
                        <Pin />{" "}
                        {!team.pinned ? (
                          <span className="ml-2">Pin to screen</span>
                        ) : (
                          <span className="ml-2">Unpin from screen</span>
                        )}
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
