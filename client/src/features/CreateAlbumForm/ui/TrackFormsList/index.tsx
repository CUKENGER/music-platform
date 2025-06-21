import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { TrackFormData } from '../../model/useCreateAlbumForm';
import { AddTrackIcon } from '@/shared/ui';
import { TrackForm } from '../TrackForm';
import styles from './index.module.scss';

interface PropTypes {
  tracks: TrackFormData[];
  addTrack: () => void;
  reorderTracks: (from: number, to: number) => void;
}

export const TrackFormsList = ({ tracks, addTrack, reorderTracks }: PropTypes) => {
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderTracks(result.source.index, result.destination.index);
  };

  return (
    <div className={styles.tracksContainer}>
      <AddTrackIcon onClick={addTrack} />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable
          droppableId="tracks"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={styles.droppable}
            >
              {tracks.map((track, index) => (
                <Draggable
                  key={track.id}
                  draggableId={track.id || `track-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles.draggable}
                    >
                      <TrackForm trackIndex={index} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
