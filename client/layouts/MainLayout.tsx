import React, { ReactNode } from 'react';
import Head from "next/head";
import Header from '@/components/Header';
import styles from '../styles/Layout.module.css'
import Player from '@/components/Player';

interface MainLayoutProps {
    title_text?: string
    title?: string;
    description?: string;
    keywords?: string;
    children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps>
    = ({
           title,
            description,
            keywords,
            children,
            title_text
       }) => {
    return (
        <>
            <Head>
                <title>{title || 'Музыкальная площадка'}</title>
                <meta name="description" content={`Музыкальная площадка. Здесь каждый может оставить свой трек и стать знаменитым.` + description}/>
                <meta name="robots" content="index, follow"/>
                <meta name="keywords" content={keywords || "Музыка, треки, артисты"}/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="shortcut icon" href="favicon.ico" />
            </Head>
            <Header title={title_text}/>
            <div className={styles.wrapper}>
                {children}
            </div>
            <Player/>
        </>
    );
};

export default MainLayout;