

export const convertDurationToTimeString = (time:number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  return formattedTime
}

export const convertDurationToSeconds = (duration: string): number => {
  const [minutes, seconds] = duration.split(':').map(Number);
  return (minutes * 60) + seconds;
};
