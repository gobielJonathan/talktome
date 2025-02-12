import chunk from "lodash/chunk";

import { Teams } from "@/models/data";
import Highlighted from "./highlighted";
import Player from "@/components/player";

import { usePeer } from "@/context/peer";
import getVideoGrid from "@/lib/get-video-grid";
import { MAX_TEAMS_GRID_PER_PAGE } from "@/models/preview";
import { RoomSlider } from "./room-slider";
import { createShareScreenPeerId } from "@/models/peer";

interface Props {
  teams: Teams;
}

export default function RoomLayout(props: Props) {
  const { teams } = props;

  const { myPeerId } = usePeer();

  const highlightTeams = Object.values(teams).filter((team) => team.pinned);
  const unHighlightTeams = Object.values(teams).filter((team) => !team.pinned);

  if (highlightTeams.length > 0) {
    return (
      <Highlighted highlighted={highlightTeams} teams={unHighlightTeams} />
    );
  }

  const isMultiplePage = unHighlightTeams.length / MAX_TEAMS_GRID_PER_PAGE >= 1;
  if (isMultiplePage) {
    return (
      <RoomSlider>
        {chunk(unHighlightTeams, MAX_TEAMS_GRID_PER_PAGE).map((teams, idx) => {
          return (
            <div
              className="grid gap-4 p-4 grid-cols-3 grid-rows-3 h-full"
              key={idx}
            >
              {teams.map((team) => {
                const { muted, video, url, username, pinned } = team;
                return (
                  <Player
                    key={team.peerId}
                    muted={muted}
                    isMe={
                      team.peerId === myPeerId ||
                      team.peerId === createShareScreenPeerId(myPeerId ?? "")
                    }
                    video={video}
                    url={url}
                    username={username}
                    pinned={pinned}
                  />
                );
              })}
            </div>
          );
        })}
      </RoomSlider>
    );
  }

  const { col, row } = getVideoGrid(unHighlightTeams.length);

  return (
    <div
      className="grid gap-4 p-4 h-full"
      style={{
        gridTemplateColumns: `repeat(${col}, 1fr)`,
        gridTemplateRows: `repeat(${row}, 1fr)`,
      }}
    >
      {unHighlightTeams.map((team) => {
        const { muted, video, url, username, pinned } = team;
        console.log(
          "is me",
          team.peerId,
          myPeerId,
          createShareScreenPeerId(myPeerId ?? "")
        );
        return (
          <Player
            key={team.peerId}
            muted={muted}
            isMe={
              team.peerId === myPeerId ||
              team.peerId === createShareScreenPeerId(myPeerId ?? "")
            }
            video={video}
            url={url}
            username={username}
            pinned={pinned}
          />
        );
      })}
    </div>
  );
}
