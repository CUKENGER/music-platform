import { Input, useDebounce} from '@/shared';
import styles from './SearchArtistInput.module.scss';
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import { useSearchArtists } from '@/entities';

interface SearchArtistInputProps {
  artist: string;
  setArtist: Dispatch<SetStateAction<string>>
}

export const SearchArtistInput: FC<SearchArtistInputProps> = ({ artist, setArtist }) => {
  const [showResults, setShowResults] = useState(true)

  const debouncedArtist = useDebounce(artist, 500);
  const { data: searchArtists } = useSearchArtists(debouncedArtist);

  const handleArtistChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchArtist = e.target.value;
    setArtist(newSearchArtist);
    setShowResults(true);
  };

  const handleArtistSelect = (selectedArtistName: string) => {
    setArtist(selectedArtistName);
    setShowResults(false);
  };

  return (
    <div>
      <Input
        value={artist}
        onChange={handleArtistChange}
        placeholder="Введите или найдите исполнителя"
        className={`${styles.input} ${searchArtists && searchArtists.length > 0 && showResults ? styles.input_active : ''}`}
      />
      {showResults && searchArtists && searchArtists.length > 0 && (
        <div className={styles.existing_artists}>
          {searchArtists.map((artist) => (
            <div
              key={artist.id}
              className={styles.search_artist}
              onClick={() => handleArtistSelect(artist.name)}
            >
              {artist.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
