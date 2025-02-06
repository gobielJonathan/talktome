import { MicOff } from "lucide-react";
import ReactPlayer from "react-player";

import Image from "next/image";
import { Team } from "@/models/data";
import { AspectRatio } from "./ui/aspect-ratio";
import clsx from "clsx";
import { memo } from "react";

function Player(
  props: Omit<Team, "peerId"> & {
    isMe: boolean;
    layout?: "ordinary" | "highlight";
  }
) {
  const { layout = "ordinary" } = props;
  return (
    <div
      className="bg-slate-800 h-full"
      style={{
        position: "relative",
        // paddingTop: getAspectRatioStyle(16, 9),
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div className="absolute z-10 bottom-1 left-2">
        <span className="text-white capitalize">{props.username}</span>
      </div>
      {props.muted && (
        <div className="absolute z-10 top-3 right-3">
          <MicOff size={16} color="white" />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontSize: "20px",
          display: props.video ? "none" : "block", // Hide video when disabled
        }}
      >
        <div
          className={clsx("w-32", {
            "w-16": layout === "highlight" && !props.pinned,
          })}
        >
          <AspectRatio ratio={1 / 1}>
            <Image
              alt="user avatar"
              src={`https://avatar.iran.liara.run/username?username=${props.username}`}
              fill
              priority
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
          display: props.video ? "block" : "none", // Hide video when disabled
        }}
        wrapper={(props) => (
          <div className="aspect-[16/7]">
            <div {...props} className=""></div>
          </div>
        )}
      />
    </div>
  );
}

export default memo(Player);
