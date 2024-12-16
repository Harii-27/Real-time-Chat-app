/**
 * Formats a given timestamp into a readable time string in HH:mm format.
 * @param timestamp - The timestamp to be formatted (in milliseconds).
 * @returns The formatted time string.
 */
export const getTimeString = (timestamp: number): string => {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formattedTime;
  };
  