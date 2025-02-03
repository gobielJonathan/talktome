const MAX_GRID_SIZE = 3;

export default function getVideoGrid(length: number) {
  if (length < MAX_GRID_SIZE) {
    return `repeat(${length}, 1fr)`;
  }
  return `repeat(${MAX_GRID_SIZE}, 1fr)`;
}
