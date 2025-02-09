import Player from "@/components/player";
import { useStream } from "@/context/stream";

import { Team } from "@/models/data";
import { usePeer } from "@/context/peer";

interface Props {
  highlighted: Team[];
  teams: Team[];
}

export default function Highlighted(props: Props) {
  const { myPeerId } = usePeer();

  return (
    <>
      <div className="highlight flex-1">
        <div
          className="grid gap-4 h-full"
          style={{
            gridTemplateColumns: `repeat(${props.highlighted.length}, 1fr)`,
          }}
        >
          {props.highlighted.map((team, index) => (
            <div key={index}>
              <Player
                url={team.url}
                muted={team.muted}
                isMe={team.peerId === myPeerId}
                video={team.video}
                username={team.username}
                pinned
                layout="highlight"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="px-2 max-h-96 basis-52">
        <div className="flex flex-row lg:flex-col gap-4">
          {props.teams.map((team, index) => (
            <div key={index} className="h-32 lg:h-[152px] w-40 lg:w-full">
              <Player
                layout="highlight"
                url={team.url}
                muted={team.muted}
                isMe={team.peerId === myPeerId}
                video={team.video}
                username={team.username}
                pinned={team.pinned}
                />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
