import { MicOff } from "lucide-react";
import ReactPlayer from "react-player";

import getAspectRatioStyle from "@/lib/get-aspect-ration-style";
import Image from "next/image";
import { Team } from "@/models/data";

export default function Player(props: Team) {
  return (
    <div
      className="bg-slate-800"
      style={{
        position: "relative",
        // paddingTop: getAspectRatioStyle(16, 9),
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      {props.muted && (
        <div className="absolute top-3 right-3">
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
        <Image
          alt="user avatar"
          src={`https://avatar.iran.liara.run/username?username=${props.username}`}
          width={128}
          height={128}
          loading="eager"
        />
      </div>
      <ReactPlayer
        playsinline
        width="100%"
        height="100%"
        playing
        url={props.url}
        muted={props.muted}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: props.video ? "block" : "none", // Hide video when disabled
        }}
        wrapper={props => <div className="aspect-[16/7]">
          <div {...props} className=""></div>
          </div>}
      />
    </div>
  );
}
