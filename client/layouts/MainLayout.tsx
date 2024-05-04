import React, { ReactNode, useEffect, useState } from 'react';
import Head from "next/head";
import Header from '@/components/Header';
import styles from '../styles/Layout.module.css'
import Loader from '@/components/Loader';
import PlayerMobile from '@/components/PlayerMobile';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import Image from 'next/image'
import arrowUp from '@/assets/arrowUp.svg'

interface MainLayoutProps {
    title_text?: string
    title?: string;
    description?: string;
    keywords?: string;
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps>
    = ({
           title,
            description,
            keywords,
            children,
            title_text
       }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false)

    const {pause, activeTrack} = useTypedSelector(state=> state.playerReducer)

    useEffect(() => {
        const handleScroll = () => {
            if( window.scrollY > 200) {
                setShowScrollButton(true)
            } else{
                setShowScrollButton(false)
            }
        };

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    if (isLoading) return <Loader/>
        
    return (
        <>
            <Head>
                <title>{title || 'Музыкальная площадка'}</title>
                <meta name="description" content={`Музыкальная площадка. Здесь каждый может оставить свой трек и стать знаменитым.` + description}/>
                <meta name="robots" content="index, follow"/>
                <meta name="keywords" content={keywords || "Музыка, треки, артисты"}/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="shortcut icon" href="/favicon.ico" />
                {pause 
                ? <link rel="shortcut icon" href="/pause.ico" />
                : <link rel="shortcut icon" href="/play.ico" />
                }
                
            </Head>
            <Header title={title_text}/>
            <div className={styles.wrapper}>
                {children}
            </div>
            <PlayerMobile/>
            {showScrollButton && (
                <button 
                    className={styles.scrollButton}
                    onClick={scrollToTop}
                >
                    <Image 
                        className={styles.arrowUp}
                        src={arrowUp} 
                        alt="button up icon"
                    />
                </button>
            )}
        </>
    );
};

export default MainLayout;