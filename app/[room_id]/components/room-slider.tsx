import clsx from "clsx";
import Glider from "react-glider";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ReactNode, PropsWithChildren, ComponentProps, useRef } from "react";
import { GliderMethods } from "react-glider/dist/types";

function RoomSliderContainer({ children }: { children: ReactNode }) {
  return (
    <div className="h-full [&_.glider]:h-full [&_.glider-track]:h-full relative">
      {children}
    </div>
  );
}

export function RoomSlider(
  props: PropsWithChildren<{
    hasDots?: boolean;
    arrow?: {
      next?: {
        children?: ReactNode;
        className?: ComponentProps<"button">["className"];
        iconSize?: number;
      };
      prev?: {
        children?: ReactNode;
        className?: ComponentProps<"button">["className"];
        iconSize?: number;
      };
    };
  }>
) {
  const { hasDots = true } = props;

  const gliderRef = useRef<GliderMethods>(null);
  const slideIndex = useRef(0);

  const nextRef = useRef(null);
  const prevRef = useRef(null);

  const next = () => {
    gliderRef.current?.scrollItem(slideIndex.current + 1);
  };
  const prev = () => {
    gliderRef.current?.scrollItem(slideIndex.current - 1);
  };

  return (
    <div className="w-full h-full relative [&_.glider-dot.active]:bg-gray-400 [&_.glider-dot]:bg-gray-700 [&_.glider-dots]:absolute [&_.glider-dots]:-bottom-[14px] [&_.glider-dots]:left-1/2 [&_.glider-dots]:-translate-x-1/2">
      <button
        className={clsx(
          "absolute z-20 top-1/2 -translate-y-1/2 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center right-6",
          props.arrow?.next?.className
        )}
        aria-label="Next"
        ref={nextRef}
        onClick={next}
      >
        {props.arrow?.next?.children ?? (
          <ArrowRight color="white" size={props.arrow?.next?.iconSize} />
        )}
      </button>

      <button
        className={clsx(
          "absolute z-20 top-1/2 -translate-y-1/2 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center left-6",
          props.arrow?.prev?.className
        )}
        aria-label="Previous"
        ref={prevRef}
        onClick={prev}
      >
        {props.arrow?.prev?.children ?? (
          <ArrowLeft color="white" size={props.arrow?.prev?.iconSize} />
        )}
      </button>

      <Glider
        hasArrows
        scrollLock
        ref={gliderRef}
        arrows={{ next: nextRef.current, prev: prevRef.current }}
        hasDots={hasDots}
        slidesToShow={1}
        slidesToScroll={1}
        scrollToPage={1}
        scrollToSlide={1}
        containerElement={RoomSliderContainer}
        onSlideVisible={(e) => {
          slideIndex.current = e.detail.slide;
        }}
      >
        {props.children}
      </Glider>
    </div>
  );
}
