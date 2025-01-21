import { DroppableProvided, DropResult } from "react-beautiful-dnd"
import { TrackForm, TrackState } from "@/entities/track"
import { DragDropContext, Draggable, DraggableProvided, Droppable } from "react-beautiful-dnd"
import styles from './TrackFormList.module.scss'
import { Dispatch, SetStateAction } from "react"

interface TrackFormListProps {
  tracks: TrackState[]
  setTracks: Dispatch<SetStateAction<TrackState[]>>
  debouncedArtist: string
}

export const TrackFormList = ({ tracks, setTracks, debouncedArtist }: TrackFormListProps) => {

  const updateTrack = (index: number, field: keyof TrackState, value: string | File | null) => {
    setTracks(prevTracks => {
      if (prevTracks[index][field] === value) return prevTracks;
      return prevTracks.map((track, i) =>
        i === index ? { ...track, [field]: value } : track
      );
    });
  };

  const removeTrack = (index: number) => {
    setTracks(prevTracks => prevTracks.map((track: TrackState, i: number) =>
      i === index
        ? { ...track }
        : track
    ).filter((i: number) => i !== index));
  };

  const updateTracks = (newTracks: TrackState[]) => {
    newTracks.forEach((track: TrackState, index: number) => {
      updateTrack(index, 'name', track.name);
      updateTrack(index, 'text', track.text);
      updateTrack(index, 'audio', track.audio);
    });
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newTracks = Array.from(tracks);
    const [reorderedTrack] = newTracks.splice(result.source.index, 1);
    newTracks.splice(result.destination.index, 0, reorderedTrack);

    updateTracks(newTracks);
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
            {tracks.map((track, index) => (
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
                      fileName={track.audio?.name}
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
