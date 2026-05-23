export function calculateMinutesAgo(dateString: string): number {
  const updatedDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - updatedDate.getTime();
  return Math.floor(diffInMs / (1000 * 60));
}

export function calculateTimeUntilBooking(bookingTime: string): string {
  const bookingDate = new Date(bookingTime);
  const now = new Date();
  const diffInMs = bookingDate.getTime() - now.getTime();
  const absDiffInMs = Math.abs(diffInMs);

  const hours = Math.floor(absDiffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((absDiffInMs % (1000 * 60 * 60)) / (1000 * 60));

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return diffInMs < 0 ? `-${formattedTime}` : formattedTime;
}
