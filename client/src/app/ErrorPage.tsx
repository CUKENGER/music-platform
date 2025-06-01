// src/components/ErrorPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.scss'; // Импорт CSS-модулей

interface ErrorPageProps {
  onReset?: () => void;
  errorMessage?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ onReset, errorMessage }) => {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Ой, что-то пошло не так!</h1>
        <p className={styles.message}>
          {errorMessage ||
            'Произошла ошибка. Попробуйте перезагрузить страницу, сбросить ошибку или вернуться на главную.'}
        </p>
        <div className={styles.actions}>
          {onReset && (
            <button className={styles.button} onClick={onReset}>
              Сбросить ошибку
            </button>
          )}
          <button className={styles.button} onClick={handleReload}>
            Перезагрузить страницу
          </button>
          <button className={`${styles.button} ${styles.secondary}`} onClick={handleGoHome}>
            На главную
          </button>
        </div>
        <p className={styles.info}>
          Если проблема сохраняется, свяжитесь с поддержкой:{' '}
          <a href="mailto:support@example.com">support@example.com</a>
        </p>
      </div>
    </div>
  );
};
