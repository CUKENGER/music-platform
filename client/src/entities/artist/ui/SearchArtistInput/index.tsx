import { useDebounce } from '@/shared/hooks';
import styles from './SearchArtistInput.module.scss';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { useSearchArtists } from '../../api/useArtistApi';
import { Input } from '@/shared/ui';

interface SearchArtistInputProps {
  artist: string;
  setArtist: Dispatch<SetStateAction<string>>
}

export const SearchArtistInput = ({ artist, setArtist }: SearchArtistInputProps) => {
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
