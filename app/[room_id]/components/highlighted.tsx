import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";

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
  const { stream } = useStream();

  return (
    <>
      <div className="highlight">
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {props.highlighted.map((team, index) => (
            <div key={index}>
              <Player
                url={stream}
                muted={team.muted}
                isMe={team.peerId === myPeerId}
                video={team.video}
                username={team.username}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="px-2 h-[600px]">
        <Swiper
          direction="vertical"
          slidesPerView={6}
          spaceBetween={100}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="h-full"
        >
          {props.teams.map((team, index) => (
            <SwiperSlide key={index}>
              <Player
                url={stream}
                muted={team.muted}
                isMe={team.peerId === myPeerId}
                video={team.video}
                username={team.username}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
