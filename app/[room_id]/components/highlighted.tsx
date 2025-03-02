import chunk from "lodash/chunk";

import Player from "@/components/player";

import { Team } from "@/models/data";
import { usePeer } from "@/context/peer";
import { MAX_TEAMS_HIGHLIGHTED_PER_PAGE_DESKTOP, MAX_TEAMS_HIGHLIGHTED_PER_PAGE_MOBILE } from "@/models/preview";
import { RoomSlider } from "./room-slider";
import { createShareScreenPeerId } from "@/models/peer";
import { useWindowSize } from "@/hooks/use-window-size";

interface Props {
  highlighted: Team[];
  teams: Team[];
}

export default function Highlighted(props: Props) {
  const { myPeerId } = usePeer();
  const windowSize = useWindowSize()
  const isMobile = windowSize === 'sm'

  return (
    <div className="flex flex-col gap-y-2 p-4 h-full">
      <div className="px-2 hidden lg:block">
        <RoomSlider
          hasDots={false}
          arrow={{
            next: { className: "w-6 h-6 -right-2 bg-gray-900", iconSize: 14 },
            prev: { className: "w-6 h-6 -left-2 bg-gray-900", iconSize: 14 },
          }}
        >
          {chunk(props.teams, isMobile ? MAX_TEAMS_HIGHLIGHTED_PER_PAGE_MOBILE : MAX_TEAMS_HIGHLIGHTED_PER_PAGE_DESKTOP).map(
            (teams, index) => (
              <div key={index} className="flex gap-x-4">
                {teams.map((team) => (
                  <div key={team.peerId} className="h-20 basis-40">
                    <Player
                      layout="highlight"
                      url={team.url}
                      muted={team.muted}
                      isMe={
                        team.peerId === myPeerId ||
                        team.peerId === createShareScreenPeerId(myPeerId ?? "")
                      }
                      video={team.video}
                      username={team.username}
                      pinned={team.pinned}
                    />
                  </div>
                ))}
              </div>
            )
          )}
        </RoomSlider>
      </div>

      <div
        className="grid gap-4 h-full"
        style={{
          gridTemplateColumns: `repeat(${props.highlighted.length}, 1fr)`,
        }}
      >
        {props.highlighted.map((team, index) => (
          <div key={index}>
            <Player
            pinned
              layout="highlight"
              url={team.url}
              muted={team.muted}
              isMe={
                team.peerId === myPeerId ||
                team.peerId === createShareScreenPeerId(myPeerId ?? "")
              }
              video={team.video}
              username={team.username}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
