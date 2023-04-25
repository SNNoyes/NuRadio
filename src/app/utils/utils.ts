export function parseTime(totalSeconds: number): string {
  totalSeconds = Math.floor(totalSeconds);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
}