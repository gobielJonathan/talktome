import { Team, Teams } from "@/models/data";
import Highlighted from "./highlighted";
import getVideoGrid from "@/lib/get-video-grid";
import Player from "@/components/player";
import { usePeer } from "@/context/peer";

interface Props {
  teams: Teams;
}

export default function RoomLayout(props: Props) {
  const { teams } = props;
  const { myPeerId } = usePeer();

  const highlightTeams = Object.values(teams).filter((team) => team.pinned);

  if (highlightTeams.length > 0) {
    const highlightTeamsId = highlightTeams.map((team) => team.peerId);

    const hightlightedTeams: Team[] = Object.entries(props.teams)
      .filter(([id]) => highlightTeamsId.includes(id))
      .map(([_, team]) => team);

    const _teams = Object.values(teams).filter((team) => !team.pinned);

    return (
      <div className="flex flex-col lg:flex-row gap-2 p-4 grow">
        <Highlighted highlighted={hightlightedTeams} teams={_teams} />
      </div>
    );
  }

  return (
    <div
      className="grid gap-2 items-center p-4 flex-grow"
      style={{
        gridTemplateColumns: getVideoGrid(Object.keys(teams).length),
      }}
    >
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
  );
}
