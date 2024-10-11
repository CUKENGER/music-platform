import { useDebounce, axiosInstance, ApiUrl } from "@/shared";
import { useEffect } from "react";
import { TrackState } from "./useCreateAlbumForm";

export const useTrackForm = (
  setAudio : (audio: File | null) => void, 
  setName: (name: string) => void, 
  debouncedArtist: string, 
  setText: (text: string) => void, 
  track: TrackState
  ) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setAudio(file);
  };

  const debouncedName = useDebounce(track.name, 500);

  useEffect(() => {
    if (track.audio?.name) {
      const str = track.audio.name;
      const word = str.split('.').slice(0, -1).join('.');
      setName(word)
    } else {
      setName('')
    }
  }, [track.audio]);

  useEffect(() => {
    const get = async () => {
      if( debouncedArtist && debouncedName) {
        try {
          const response = await axiosInstance.get(ApiUrl + 'lyrics/search', {
            params: {track_name: debouncedName, artist_name: debouncedArtist}
          });
          
          if (response.data.track_id) {
            const lyricsResponse = await axiosInstance.get(ApiUrl + `lyrics?track_id=${response.data.track_id}`);
            setText(lyricsResponse.data)
          }
        } catch(e) {
          console.error('Error in get lyrics', e)
        }
      }
    }
    get()
  }, [debouncedArtist, debouncedName])
  
  return {
    handleFileChange
  }
}