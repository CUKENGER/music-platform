
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${secondsStr}`;
}


export const getListenWordForm = (count: number): string => {
  let remainder10 = count % 10;
  let remainder100 = count % 100;

  if (remainder10 === 1 && remainder100 !== 11) {
    return 'прослушивание';
  } else if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 10 || remainder100 >= 20)) {
    return 'прослушивания';
  } else {
    return 'прослушиваний';
  }
}

const months = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}