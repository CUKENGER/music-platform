import { audioManager, axiosInstance} from '@/shared'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// Функция для загрузки чанков
const fetchAudioChunk = async (url: string, rangeStart: number, rangeEnd: number): Promise<ArrayBuffer> => {
  const response = await axiosInstance.get(url, {
    responseType: 'arraybuffer', // Ожидаем, что данные придут в формате ArrayBuffer
    headers: {
      Range: `bytes=${rangeStart}-${rangeEnd}`, // Загружаем часть файла с диапазоном байтов
    },
  });

  if (response.data instanceof ArrayBuffer) {
    return response.data; // Если данные пришли как ArrayBuffer, возвращаем их
  } else {
    throw new Error("Expected an ArrayBuffer response");
  }
};

export const useStreamAudio = (url: string, rangeStart: number, rangeEnd: number) => {
  return useQuery<ArrayBuffer, Error>({
    queryKey: ['audio', rangeStart, rangeEnd],
    queryFn: () => fetchAudioChunk(url, rangeStart, rangeEnd),
    refetchOnWindowFocus: false,
    enabled: !!url, // Запрос выполняется только при наличии URL
  });
};

export const Player = ({ audioUrl }: { audioUrl: string }) => {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const chunkSize = 1024 * 1024; // 1MB
  const rangeStart = currentChunkIndex * chunkSize;
  const rangeEnd = rangeStart + chunkSize - 1;

  // Используем хук для загрузки аудио данных
  const { data, isSuccess } = useStreamAudio(audioUrl, rangeStart, rangeEnd);

  useEffect(() => {
    // Инициализируем MediaSource в AudioManager
    audioManager.initializeMediaSource();

    // При успешной загрузке чанка добавляем его в буфер
    if (isSuccess && data) {
      audioManager.appendAudioChunk(data);
    }
  }, [isSuccess, data]);

  // Продолжить загрузку следующего чанка при необходимости
  useEffect(() => {
    if (isSuccess && data) {
      // Загружаем следующий чанк через некоторое время (когда нужно)
      const timer = setTimeout(() => {
        setCurrentChunkIndex((prev) => prev + 1);
      }, 500); // Задержка перед загрузкой следующего чанка

      return () => clearTimeout(timer);
    }
  }, [isSuccess, data]);

  return (
    <div>
      <button onClick={() => audioManager.audio?.play()}>Play</button>
      <button onClick={() => audioManager.pause()}>Pause</button>
    </div>
  );
};

// export const Player = () => {

//   const {
//     activeTrack,
//     handleOpen,
//     isOpenPlayer,
//   } = usePlayer()

//   useEffect(() => {
//     if (activeTrack) {
//       audioManager.streamAudio(ApiUrl + activeTrack.audio);
//     }
//   }, [activeTrack]);

//   if (!activeTrack) {
//     return null
//   }

//   return (
//     <>
//       <div className={styles.container} >
//         <TrackProgress />
//         <div className={styles.main_container} onClick={handleOpen}>
//           <div className={styles.main_info_container}>
//             <div className={styles.cover_container}>
//               <img
//                 className={styles.cover}
//                 src={ApiUrl + activeTrack?.picture}
//                 alt="cover"
//               />
//             </div>
//             <div className={styles.duration}>
//               <CurrentTimeContainer
//                 duration={activeTrack?.duration}
//               />
//             </div>
//             <PlayerNameContainer
//               name={activeTrack?.name}
//               artist={activeTrack?.artist.name ?? 'Unknown artist'}
//             />
//             <TrackLikeContainer
//               likes={activeTrack.likes}
//               id={activeTrack.id}
//             />
//           </div>
//           <div className={styles.play_btns}>
//             <SwitchTrackBtns isNextBtn={false} />
//             <PlayPauseBtn />
//             <SwitchTrackBtns isNextBtn={true} />
//           </div>

//           <div className={styles.right_container}>
//             <MixIcon />
//             <VolumeBar />
//             <div onClick={handleOpen}>
//               <img
//                 className={styles.openBtn}
//                 src={openPlayerBtn}
//                 alt="openPlayerBtn"
//               />
//             </div>
//           </div>
//         </div>

//       </div>
//       {isOpenPlayer && (
//         <Portal selector="#portal-root" isOpen={isOpenPlayer}>
//           <PlayerDetailed />
//         </Portal>
//       )}
//     </>
//   )
// }