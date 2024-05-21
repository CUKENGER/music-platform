'use client'

import React, { ReactNode, useEffect, useState } from 'react';
import Head from "next/head";
import styles from '@/styles/Layout.module.css'
import { useTypedSelector } from '@/hooks/useTypedSelector';
import Image from 'next/image'
import arrowUp from '@/assets/arrowUp.png'
import Loader from '@/components/Loader/Loader';
import Header from '@/components/Header/Header';
import PlayerMobile from '@/components/Player/PlayerMobile/PlayerMobile';
import PlayerDetailed from "@/components/Player/PlayerDetailed/PlayerDetailed";
import PageTransition from '@/UI/PageTransition/PageTransition';
import { CSSTransition } from 'react-transition-group';

interface MainLayoutProps {
    title_text?: string;
    title?: string;
    description?: string;
    keywords?: string;
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    title,
    description,
    keywords,
    children,
    title_text
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

    const { pause, isOpenPlayerDetailed } = useTypedSelector(state => state.playerReducer);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const body = document.body;
        if (isOpenPlayerDetailed) {
            body.classList.add(styles.noscroll);
        } else {
            body.classList.remove(styles.noscroll);
        }

        // Очистка эффекта при размонтировании компонента
        return () => {
            body.classList.remove(styles.noscroll);
        };
    }, [isOpenPlayerDetailed]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) return (
        <CSSTransition
            in={isLoading}
            timeout={300}
            classNames={{
                enter: styles['loader-enter'],
                enterActive: styles['loader-enter-active'],
                exit: styles['loader-exit'],
                exitActive: styles['loader-exit-active'],
            }}
            unmountOnExit
        >
            <Loader />
        </CSSTransition>
    );

    return (
        <>
            <Head>
                <title>{title || 'Музыкальная площадка'}</title>
                <meta name="description" content={`Музыкальная площадка. Здесь каждый может оставить свой трек и стать знаменитым.` + description} />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content={keywords || "Музыка, треки, артисты"} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {pause
                    ? <link rel="shortcut icon" href="pause.ico" />
                    : <link rel="shortcut icon" href="play.ico" />
                }
            </Head>
            <Header title={title_text} />
            <PageTransition>
                <div className={styles.wrapper}>
                    {children}
                </div>
            </PageTransition>
            <PlayerMobile />
            {isOpenPlayerDetailed && (
                <CSSTransition
                    in={isOpenPlayerDetailed}
                    timeout={300}
                    classNames={{
                        enter: styles['page-enter'],
                        enterActive: styles['page-enter-active'],
                        exit: styles['page-exit'],
                        exitActive: styles['page-exit-active'],
                    }}
                    unmountOnExit
                >
                    <PlayerDetailed />
                </CSSTransition>
            )}
            <CSSTransition
                in={showScrollButton && !isOpenPlayerDetailed}
                timeout={300}
                classNames={{
                    enter: styles['scrollButton-enter'],
                    enterActive: styles['scrollButton-enter-active'],
                    exit: styles['scrollButton-exit'],
                    exitActive: styles['scrollButton-exit-active'],
                }}
                unmountOnExit
            >
                <button
                    className={styles.scrollButton}
                    onClick={scrollToTop}
                >
                    <Image
                        className={styles.arrowUp}
                        src={arrowUp}
                        alt="button up icon"
                        loading='eager'
                    />
                </button>
            </CSSTransition>
        </>
    );
};

export default MainLayout;
