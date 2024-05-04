import { useEffect, useRef, useState } from "react";

export default function useScroll(callback: any) {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                    document.documentElement.offsetHeight &&
                !isFetching
            ) {
                setIsFetching(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetching]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isFetching) return;

            try {
                await callback();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [isFetching]);

    return [isFetching, setIsFetching];
}

