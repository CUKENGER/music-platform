import { Input, useDebounce, UseInputProps } from '@/shared';
import styles from './SearchArtistInput.module.scss';
import { ChangeEvent, FC, useState } from 'react';
import { useSearchArtists } from '@/entities';

interface SearchArtistInputProps {
  artist: UseInputProps;
}

export const SearchArtistInput: FC<SearchArtistInputProps> = ({ artist }) => {
  const [showResults, setShowResults] = useState(true)

  const debouncedArtist = useDebounce(artist.value, 500);
  const { data: searchArtists } = useSearchArtists(debouncedArtist);

  const handleArtistChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchArtist = e.target.value;
    artist.setValue(newSearchArtist);
    setShowResults(true);
  };

  const handleArtistSelect = (selectedArtistName: string) => {
    artist.setValue(selectedArtistName);
    setShowResults(false);
  };

  return (
    <div>
      <Input
        inputValue={artist}
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
