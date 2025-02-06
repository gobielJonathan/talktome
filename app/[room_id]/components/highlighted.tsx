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
      <div className="highlight">
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
      <div className="px-2 max-h-96">
        <div className="flex flex-col gap-y-4">
          {props.teams.map((team, index) => (
            <div key={index} className="h-[152px]">
              <Player
                url={team.url}
                muted={team.muted}
                isMe={team.peerId === myPeerId}
                video={team.video}
                username={team.username}
                layout="highlight"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
