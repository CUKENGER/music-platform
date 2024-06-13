import ImageInput from '@/UI/ImageInput/ImageInput'
import InputString from '@/UI/InputString/InputString'
import Textarea from '@/UI/Textarea/Textarea'
import MainLayout from '@/layouts/MainLayout'
import styles from '@/styles/CreateAlbum.module.css'
import AddTracksContainer from '@/components/Albums/Create/AddTracksContainer/AddTracksContainer'
import ModalContainer from '@/UI/ModalContainer/ModalContainer'
import SearchInput from '@/UI/SearchInput/SearchInput'
import Btn from '@/UI/Btn/Btn'
import CheckInput from '@/UI/CheckInput/CheckInput'
import useCreateAlbum from '@/api/Album/useCreateAlbum'

const CreateAlbum = () => {

	const {
		showModal,
		hideModal,
		modal,
		handleInputDateChange,
		handleAddInput,
		handleCreate,
		name,
		artist,
		isNeedInput,
		releaseDate,
		genre,
		options,
		setOptions,
		description,
		setCover,
		tracks,
		setTracks,
		isLoading
	} = useCreateAlbum()

	return (
		<MainLayout title_text='Загрузка альбома'>
			<div className={styles.container}>
				<div className={styles.mainInfo_container}>
					<div className={styles.inputs_container}>

						<InputString
							value={name.value}
							setValue={name.setValue}
							placeholder='Введите название альбома'
							isRequired={true}
						/>
						{!isNeedInput && (
							<>
								<label htmlFor="dsad">Найти и выбрать исполнителя</label>
								<SearchInput
									value={artist.value}
									setValue={artist.setValue}
								/>
								<Btn onClick={handleAddInput}>Не нашли исполнителя?</Btn>
							</>
						)}

						{isNeedInput && (
							<>
								<InputString
									value={artist.value}
									setValue={artist.setValue}
									placeholder='Добавить исполнителя'
									isRequired={true}
								/>
								<Btn onClick={handleAddInput}>Назад</Btn>
							</>
						)}
						<label id='label_input_date' htmlFor="input_date">Введите дату выхода</label>
						<input
							value={releaseDate.value}
							onChange={handleInputDateChange}
							className={styles.input_date}
							id='input_date'
							type='date'
							required={true}
						/>
						<div className={styles.SelectInput_container}>
							<label htmlFor="dsadsad">Выберите жанр альбома</label>
							<CheckInput
								value={genre.value}
								options={options}
								setOptions={setOptions}
								setValue={genre.setValue}
							/>
						</div>
						<Textarea
							value={description.value}
							setValue={description.setValue}
							placeholder='Введите описание к альбому'
							isRequired={true}
							onChangeNeed={true}
						/>
					</div>
					<div className={styles.inputPhoto_container}>
						<div>
							<p>Загрузите обложку альбома</p>
						</div>
						<div className={styles.ImageInput_container}>
							<ImageInput
								setPicture={setCover}
								placeholder='Выберите файл'
							/>
						</div>
					</div>
				</div>
				<AddTracksContainer
					tracks={tracks}
					setTracks={setTracks}
				/>
				<button className={styles.nextBtn} onClick={handleCreate}>
					{isLoading && (<span className={styles.loader}></span>)}
					Отправить
				</button>
				{modal.isOpen && (
					<ModalContainer
						onClick={modal.onClick}
						text={modal.message}
						hideModal={hideModal}
					/>
				)}

			</div>
		</MainLayout>
	)
}

export default CreateAlbum

