// pages/404.tsx
import { FC } from 'react';
import Link from 'next/link';
import styles from '@/styles/404.module.css';
import Head from 'next/head';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>404 - Страница не найдена</title>
                <meta name="description" content="Извините, но страница, которую вы ищете, не существует." />
            </Head>

                <div className={styles.container}>
                        <h1 className={styles.title}>404 - Страница не найдена</h1>
                        <p className={styles.description}>Извините, но страница, которую вы ищете, не существует.</p>
                        <Link href="/">
                            Вернуться на главную
                        </Link>
                </div>

        </>
    );
};

