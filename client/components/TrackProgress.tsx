import { ChangeEvent, FC } from "react";
import styles from '@/styles/TrackProgress.module.css'


interface TrackProgressProps {
    left: number;
    right: number;
    onChange: (e:ChangeEvent<HTMLInputElement>)=> void;
    isVolume: boolean;
}

const TrackProgress:FC<TrackProgressProps> = ({left, right, onChange, isVolume}) => {

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${secondsStr}`;
    };

    return (
        <div className={isVolume ? styles.container : styles.duration_container}>   
        {isVolume 
        ? (
            <input 
            min={0}
            max={right}
            value={left}
            onChange={onChange}
            className={styles.input} 
            type="range" 
            style={{ '--value': `${(left / right) * 100}%` } as any}
            />
        )
        : (
            <>
                <p className={styles.time}>{formatTime(left)}</p>
                <input 
                min={0}
                max={right}
                value={left}
                onChange={onChange}
                className={styles.input} 
                type="range" 
                style={{ '--value': `${(left / right) * 100}%` } as any}
                />
                <p className={styles.time}>{formatTime(right)}</p>
            </>
        )
        }
              
        </div>
    )
}

export default TrackProgress