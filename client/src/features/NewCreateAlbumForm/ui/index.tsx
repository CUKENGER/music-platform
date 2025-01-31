import { FormEvent, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import {
  AddTrackIcon,
  Btn,
  InputImageFile,
  ModalContainer,
  Options,
  UITextAreaField,
  UITextField,
} from '@/shared/ui';
import { PRIVATE_ROUTES } from '@/shared/consts';
import { Controller, FormProvider, SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { SearchArtistInput } from '@/entities/artist';
import { genres } from '@/shared/moks';
import Flatpickr from 'react-flatpickr';
import { useCreateAlbum, CreateAlbumDto } from '@/entities/album';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useModal } from '@/shared/hooks';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd';

interface TrackState {
  name: string;
  text: string;
  audio: File | null;
}

interface AlbumCommonFormProps {
  onSubmit: (e: FormEvent) => void;
  backLink: string;
  children: ReactNode;
  isPending: boolean;
  hasData: boolean;
}

export const AlbumCommonForm = ({
  onSubmit,
  backLink,
  children,
  isPending,
  hasData,
}: AlbumCommonFormProps) => {
  return (
    <form className={styles.Form} onSubmit={onSubmit}>
      <Link to={backLink}>
        <Btn>Назад</Btn>
      </Link>
      {children}
      <Btn isLoading={isPending} type="submit" disabled={!hasData}>
        Загрузить
      </Btn>
    </form>
  );
};

export type CreateAlbumInputs = {
  name: string;
  artist: string;
  genre: string;
  description: string;
  cover?: File | null;
  releaseDate: Date | string | undefined;
  tracks?: TrackState[];
};

export const CreateAlbumForm = () => {
  const methods = useForm<CreateAlbumInputs>({});
  const { getValues, control, handleSubmit, setValue } = methods;
  const values = getValues();
  const { modal, showModal, hideModal } = useModal();

  // const debouncedArtist = useDebounce(values.artist, 500);
  const addTrackForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const prevTracks = getValues('tracks') || [];
    setValue('tracks', [...prevTracks, { name: '', text: '', audio: null }]);
  };
  const navigate = useNavigate();

  const { isPending, mutate: createAlbum } = useCreateAlbum();
  const hasData = !!(
    values.name &&
    values.artist &&
    values.genre &&
    values.releaseDate &&
    values.cover &&
    values.tracks?.length &&
    values.tracks?.length > 0 &&
    values.tracks.every((track) => track.name.trim() && track.audio)
  );

  const onSubmit: SubmitHandler<CreateAlbumInputs> = () => {
    if (!hasData) {
      showModal('Заполните все данные, пожалуйста');
      return;
    }

    const track_names = values.tracks?.map((track) => track.name) || [];
    const track_texts = values.tracks?.map((track) => track.text) || [];

    const albumData: CreateAlbumDto = {
      name: values.name,
      artist: values.artist,
      genre: values.genre,
      description: values.description,
      picture: values.cover as File,
      tracks: values.tracks || [],
      track_names: track_names,
      track_texts: track_texts,
      releaseDate:
        values.releaseDate instanceof Date ?
          values.releaseDate.toISOString()
        : (values.releaseDate as string),
    };

    createAlbum(albumData, {
      onSuccess: (res) => {
        showModal(`Альбом ${res.name} успешно загружен`, () => navigate(PRIVATE_ROUTES.ALBUMS));
      },
      onError: (e) => {
        showModal(`Произошла ошибка при создании альбома ${e}`);
      },
    });
  };

  return (
    <AlbumCommonForm
      backLink={PRIVATE_ROUTES.ALBUMS}
      onSubmit={handleSubmit(onSubmit)}
      hasData={hasData}
      isPending={isPending}
    >
      <FormProvider {...methods}>
        <div>
          <Controller
            name="cover"
            control={control}
            render={({ field }) => (
              <InputImageFile 
                setFile={field.onChange} 
                placeholder="Загрузите обложку альбома" 
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="tracks"
            control={control}
            render={({ field }) => (
              <input 
                type="file" 
                id={'album-audio'} 
                accept="audio/*" 
                multiple 
                {...field} 
              />
            )}
          />
          <label htmlFor={`album-audio`} data-tooltip-id="downloadMultipleButton">
            Загрузите аудиодорожки
          </label>
          <ReactTooltip
            id="downloadMultipleButton"
            place="top"
            content="Загрузить несколько файлов"
            delayShow={3000}
          />
        </div>

        <AddTrackIcon onClick={addTrackForm} />
      </FormProvider>
      <ModalContainer modal={modal} hideModal={hideModal} />
    </AlbumCommonForm>
  );
};

export const TrackFormsList = () => {
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="tracks">
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            // className={styles.tracks_container}
          >
            {tracks.map((track, index) => (
              <Draggable key={index} draggableId={index.toString()} index={index}>
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  ></div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export const InputsContainer = () => {
  const { control, setValue } = useFormContext();

  return (
    <div>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <UITextField
            name="name"
            value={field.value}
            onChange={field.onChange}
            placeholder="Введите название"
          />
        )}
      />
      <Controller
        name="artist"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <SearchArtistInput artist={field.value} onChange={field.onChange} />}
      />
      <Controller
        name="description"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <UITextAreaField
            placeholder="Введите описание"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <label>Введите дату выхода</label>
      <Controller
        name="releaseDate"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Flatpickr
            data-enable-time
            options={{
              dateFormat: 'd-m-Y',
              maxDate: new Date(),
              onChange: (selectedDates) => {
                setValue('releaseDate', selectedDates[0]);
              },
              defaultDate: field.value,
            }}
          />
        )}
      />
      <Controller
        name="genre"
        control={control}
        rules={{ required: true }}
        render={() => <Options options={genres} />}
      />
    </div>
  );
};
