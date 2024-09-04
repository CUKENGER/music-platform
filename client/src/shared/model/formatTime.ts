

export const formatTime = (time:number):string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  return formattedTime
}