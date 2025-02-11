export default function getVideoGrid(length: number) {
  if (length === 1) {
    return { col: 1, row: 1 };
  }
  if (length === 2) {
    return { col: 2, row: 1 };
  }
  if (length >= 3 && length <= 6) {
    return { col: 3, row: 2 };
  }
  return { col: 3, row: 3 };
}
