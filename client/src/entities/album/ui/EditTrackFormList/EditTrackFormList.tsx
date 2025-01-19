import { TrackForm, TrackUpdateState } from "@/entities"
import { DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided, DropResult } from "react-beautiful-dnd"
import { UseFormGetValues, UseFormSetValue } from "react-hook-form"
import styles from './EditTrackFormList.module.scss'
import { EditAlbumInputs } from "@/features/EditAlbumFormLib/model/useEditAlbumForm";

interface EditTrackFormListProps {
  tracks: TrackUpdateState[] | undefined;
  debouncedArtist: string;
  setValue: UseFormSetValue<EditAlbumInputs>;
  getValues: UseFormGetValues<EditAlbumInputs>
}

export const EditTrackFormList = ({ tracks, debouncedArtist, setValue, getValues }: EditTrackFormListProps) => {

  const updateTrack = (index: number, field: keyof TrackUpdateState, value: string | File | null) => {
    const prevTracks = getValues('tracks') || [];
    const updatedTracks = prevTracks.map((track, i) =>
      i === index ? { ...track, [field]: value, isUpdated: true } : track
    );
    setValue('tracks', updatedTracks);
  };

  const removeTrack = (index: number) => {
    const prevTracks = getValues('tracks') || [];
    const [removedTrack] = prevTracks.splice(index, 1);
    const prevDeletedTracks = getValues('deletedTracks') || []
    setValue('deletedTracks', [...prevDeletedTracks, removedTrack]);
    setValue('tracks', prevTracks);
  };

  const updateTracks = (newTracks: TrackUpdateState[]) => {
    newTracks.forEach((track: TrackUpdateState, index: number) => {
      updateTrack(index, 'name', track.name);
      updateTrack(index, 'text', track.text);
      updateTrack(index, 'audio', track.audio);
    });
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if(tracks) {
      const newTracks = Array.from(tracks);
      const [reorderedTrack] = newTracks.splice(result.source.index, 1);
      newTracks.splice(result.destination.index, 0, reorderedTrack);
  
      updateTracks(newTracks);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="tracks">
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={styles.tracks_container}
          >
            {tracks &&
              tracks.map((track, index) => (
                <Draggable key={index} draggableId={index.toString()} index={index}>
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TrackForm
                        track={track}
                        setName={(name) => updateTrack(index, 'name', name)}
                        setText={(text) => updateTrack(index, 'text', text)}
                        setAudio={(audio) => updateTrack(index, 'audio', audio)}
                        removeTrack={() => removeTrack(index)}
                        trackIndex={index}
                        fileName={track.isExist ? 'Изменить аудиодорожку' : undefined}
                        debouncedArtist={debouncedArtist}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
