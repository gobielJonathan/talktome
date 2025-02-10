import { MicOff } from "lucide-react";
import ReactPlayer from "react-player";

import Image from "next/image";
import { Team } from "@/models/data";
import { AspectRatio } from "./ui/aspect-ratio";
import clsx from "clsx";
import { memo } from "react";

type Props = Omit<Team, "peerId"> & {
  isMe: boolean;
  layout?: "ordinary" | "highlight";
};

function Player(props: Props) {
  const { layout = "ordinary" } = props;

  return (
    <div className="bg-slate-800 relative rounded-[10px] overflow-hidden">
      <div className="absolute z-10 bottom-1 left-2">
        <span className="text-white capitalize">{props.username}</span>
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
          className={clsx("w-32", {
            "!w-16": layout === "highlight" && !props.pinned,
          })}
        >
          <AspectRatio ratio={1 / 1}>
            <Image
              fill
              alt={`user avatar ${props.username}`}
              src={`https://avatar.iran.liara.run/username?username=${props.username}`}
              fetchPriority="high"
            />
          </AspectRatio>
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
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: props.video ? "block" : "none", // Hide video when disabled
        }}
        wrapper={(props) => (
          <div className="aspect-video">
            <div {...props} className=""></div>
          </div>
        )}
      />
    </div>
  );
}

export default memo(Player);
