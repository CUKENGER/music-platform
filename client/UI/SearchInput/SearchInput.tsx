import { useSearchByNameArtistsQuery } from "@/api/ArtistService";
import { ChangeEvent, FC, memo,useState } from "react";
import styles from './SearchInput.module.css'

interface SearchInputProps{
    value: string;
    setValue: (e:string) => void;
}

const SearchInput:FC<SearchInputProps> = memo(({setValue, value}) =>{

    const [query, setQuery] = useState<string>('')
    // const [value, setValue] = useState<string>('')
    const [isQuery, setIsQuery] = useState<boolean>(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        setValue(e.target.value)
        setIsQuery(true)
    }

    const {data: searchResults} = useSearchByNameArtistsQuery({
        count: 50,
        offset: 0,
        query: query
    })

    const handleClickResult = (name: string) => {
        setValue(name)
        setQuery('')
        setIsQuery(false)
    }

    return (
        <div className={styles.container}>
            <input
                className={isQuery ? styles.input_open : styles.input}
                onChange={handleChange}
                value={value}
                type="text"
            />
            <ul className={styles.list}>
                {isQuery && searchResults 
                && (searchResults.map((result) => (
                    <li key={result.id} className={styles.list_item} onClick={() => handleClickResult(result.name)}>
                        {result.name}
                    </li>
                )))
                }
            </ul>
        </div>
    )
})

export default SearchInput