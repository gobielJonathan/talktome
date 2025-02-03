export default function getAspectRatioStyle(width: number,height: number) {
  return `${height / width * 100}%`;
}