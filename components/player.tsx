import { MicOff } from "lucide-react";
import ReactPlayer from "react-player";
import clsx from "clsx";
import { memo } from "react";

import { Team } from "@/models/data";
import Avatar from "@/app/[room_id]/components/avatar";

type Props = Omit<Team, "peerId"> & {
  isMe: boolean;
  layout?: "ordinary" | "highlight";
};

function Player(props: Props) {
  const { layout = "ordinary" } = props;

  return (
    <div className="bg-slate-800 relative rounded-[10px] overflow-hidden w-full h-full">
      <div className="absolute z-10 bottom-1 left-2">
        <span className="text-white text-sm capitalize">{props.username}</span>
      </div>
      {props.muted && (
        <div className="absolute z-10 top-3 right-3">
          <MicOff size={16} color="white" />
        </div>
      )}

      <div
        className={clsx(
          "absolute top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2 text-xl",
          {
            hidden: props.video,
            block: !props.video,
          }
        )}
      >
        <div
          className={clsx("w-32 h-32", {
            "!w-16 !h-16": layout === "highlight" && !props.pinned,
          })}
        >
          <Avatar name={props.username} />
        </div>
      </div>
      <ReactPlayer
        playsinline
        width="100%"
        height="100%"
        playing
        url={props.url}
        muted={props.isMe ? true : props.muted}
        style={{
          position: "absolute",
          objectFit: "cover",
          display: props.video ? "block" : "none", // Hide video when disabled
        }}
        wrapper={(props) => (
          <div className="w-full h-full">
            <div {...props}></div>
          </div>
        )}
      />
    </div>
  );
}

export default memo(Player);
