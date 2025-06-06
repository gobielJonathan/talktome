import clsx from "clsx";
import { memo } from "react";

const backgroundColors = [
  "bg-red-400",
  "bg-orange-400",
  "bg-lime-400",
  "bg-emerald-400",
  "bg-sky-400",
  "bg-violet-400",
  "bg-pink-400",
];

function getSymbolName(name: string) {
  if (name.split(" ").length > 1) {
    const [first, second] = name.split(" ");
    return first.charAt(0).toUpperCase() + second.charAt(0).toUpperCase();
  }
  return name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase();
}

function Avatar(props: { name: string; textSize: "lg" | "sm" }) {
  return (
    <div
      className={clsx(
        "w-full h-full rounded-full flex items-center justify-center",
        backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
      )}
    >
      <span
        className={clsx({
          "text-3xl": props.textSize === "lg",
          "text-lg": props.textSize === "sm",
        })}
      >
        {getSymbolName(props.name.trim())}
      </span>
    </div>
  );
}

export default memo(Avatar);
