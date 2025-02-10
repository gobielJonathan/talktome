import { ReactNode } from "react";
import chunk from "lodash/chunk";
import Glider from "react-glider";

import { Team, Teams } from "@/models/data";
import Highlighted from "./highlighted";
import Player from "@/components/player";

import { usePeer } from "@/context/peer";
import "glider-js/glider.min.css";

interface Props {
  teams: Teams;
}

function RoomSlider({ children }: { children: ReactNode }) {
  return (
    <>
      <Glider
        hasDots
        slidesToShow={1}
        slidesToScroll={1}
        scrollToPage={1}
        scrollToSlide={1}
      >
        {children}
      </Glider>
    </>
  );
}

export default function RoomLayout(props: Props) {
  const { teams: _teams } = props;
  const teams = Array(20).fill(Object.values(_teams)).flat();

  const { myPeerId } = usePeer();

  const highlightTeams = Object.values(teams).filter((team) => team.pinned);

  if (highlightTeams.length > 0) {
    const highlightTeamsId = highlightTeams.map((team) => team.peerId);

    const hightlightedTeams: Team[] = Object.entries(props.teams)
      .filter(([id]) => highlightTeamsId.includes(id))
      .map(([_, team]) => team);

    const _teams = Object.values(teams).filter((team) => !team.pinned);

    return (
      <div className="flex flex-col lg:flex-row gap-2 p-4">
        <Highlighted highlighted={hightlightedTeams} teams={_teams} />
      </div>
    );
  }

  return (
    <RoomSlider>
      {chunk(teams, 9).map((teams, idx) => (
        <div className="grid gap-4 p-4 grid-cols-3 grid-rows-3" key={idx}>
          {Object.entries(teams).map(([id, team]) => {
            const { muted, video, url, username, pinned } = team;
            return (
              <Player
                key={id}
                muted={muted}
                isMe={id === myPeerId}
                video={video}
                url={url}
                username={username}
                pinned={pinned}
              />
            );
          })}
        </div>
      ))}
    </RoomSlider>
  );
}
