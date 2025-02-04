import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import Player from "@/components/player";
import { useStream } from "@/context/stream";
import { CONFIG_NAME } from "@/models/storage";

// Import Swiper styles
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";

export default function Highlighted() {
  const { stream } = useStream();

  return (
    <>
      <div className="highlight">
        <Player
          muted
          isMe
          video
          url={stream}
          username={localStorage.getItem(CONFIG_NAME) ?? "Jhon Doe"}
        />
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
          <SwiperSlide>
            <div className="rounded-[10px]">
              <Player
                muted
                isMe
                video
                url={stream}
                username={localStorage.getItem(CONFIG_NAME) ?? "Jhon Doe"}
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
