import { Reorder } from 'framer-motion';
import { AddTrackIcon } from '@/shared/ui';
import { TrackForm } from '../TrackForm';
import styles from './index.module.scss';
import { TrackFormData } from '../../model/useCreateAlbumForm';
import { useState, useRef } from 'react';

interface PropTypes {
  tracks: TrackFormData[];
  addTrack: () => void;
  reorderTracks: (from: number, to: number) => void;
  removeTrack: (id: string) => void;
}

export const TrackFormsList = ({ tracks, addTrack, reorderTracks, removeTrack }: PropTypes) => {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleReorder = (newTracks: TrackFormData[]) => {
    const oldIndices = tracks.map((t) => t.id);
    const newIndices = newTracks.map((t) => t.id);

    for (let i = 0; i < oldIndices.length; i++) {
      if (oldIndices[i] !== newIndices[i]) {
        const from = i;
        const to = newIndices.indexOf(oldIndices[i]);
        if (from !== to) {
          console.log(`Moving track from ${from} to ${to}`);
          reorderTracks(from, to);
        }
        break;
      }
    }
  };

  const handleRemove = (id: string) => {
    if (containerRef.current) {
      const scrollPosition = window.scrollY;
      setRemovingId(id);
      setTimeout(() => {
        setRemovingId(null);
        removeTrack(id);
        window.scrollTo(0, scrollPosition);
      }, 300);
    }
  };

  return (
    <div
      className={styles.tracksContainer}
      ref={containerRef}
    >
      <Reorder.Group
        axis="y"
        values={tracks}
        onReorder={handleReorder}
        className={styles.droppable}
      >
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`${styles.draggableItem} ${
              removingId === track.id ? styles.removing : styles.adding
            }`}
          >
            <Reorder.Item
              value={track}
              whileDrag={{
                scale: 1.02,
                boxShadow: '0 4px 8px rgba(224, 156, 156, 0.2)',
                border: '2px solid var(--prm)',
                borderRadius: '10px',
              }}
            >
              <TrackForm
                trackIndex={tracks.findIndex((t) => t.id === track.id)}
                onRemove={() => handleRemove(track.id)}
              />
            </Reorder.Item>
          </div>
        ))}
      </Reorder.Group>
      <AddTrackIcon
        onClick={() => {
          addTrack();
        }}
      />
    </div>
  );
};
