export function calculateMinutesAgo(dateString: string): number {
  const updatedDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - updatedDate.getTime();
  return Math.floor(diffInMs / (1000 * 60));
}
