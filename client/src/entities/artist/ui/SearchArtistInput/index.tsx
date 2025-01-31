import { useDebounce } from '@/shared/hooks';
import styles from './SearchArtistInput.module.scss';
import { ChangeEvent, InputHTMLAttributes, useState } from 'react';
import { useSearchArtists } from '../../api/useArtistApi';
import { UIInput } from '@/shared/ui/UIInput';
import { UILabel } from '@/shared/ui/UILabel';

interface SearchArtistInputProps extends InputHTMLAttributes<HTMLInputElement> {
	artist: string;
	setArtist: (value: string) => void;
	label?: string;
}

export const SearchArtistInput = ({ artist, setArtist, label, ...inputProps }: SearchArtistInputProps) => {
	const [showResults, setShowResults] = useState(true);

	const debArtist = useDebounce(artist, 500);
	const { data: searchArtists } = useSearchArtists(debArtist);

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
		
			{label && <UILabel>{label}</UILabel>}

			<UIInput
				value={artist}
				onChange={handleArtistChange}
				className={`${styles.input} ${searchArtists && searchArtists.length > 0 && showResults ? styles.input_active : ''}`}
				{...inputProps}
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
