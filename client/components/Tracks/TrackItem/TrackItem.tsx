import { FC, useEffect } from "react"
import delete_icon from '@/assets/delete.svg'
import Image from 'next/image'
import styles from './TrackItem.module.css'
import { ITrack } from "@/types/track";
import useActions from "@/hooks/useActions"
import { useTypedSelector } from "@/hooks/useTypedSelector"
import { baseUrl } from "@/services/baseUrl"
import audioManager from "@/services/AudioManager"
import React from "react";
import { useDeleteTrackMutation } from "@/api/Track/TrackService";
import PlayPauseBtns from "@/UI/PlayPauseBtns/PlayPauseBtns";
import withAudioPlayer from "@/components/hocs/withAudioPlayer";
import { formatTime, getListenWordForm } from "@/services/format";
import { usePlayer } from "@/hooks/player/usePlayer";

interface TrackItemProps {
	track: ITrack;
	trackList: ITrack[];
	setAudio: () => void
}

const TrackItem: FC<TrackItemProps> = ({ track, trackList, setAudio }) => {
	const audio = audioManager.audio

	const {playBtn, handleTrackClick} = usePlayer()

	const { activeTrack, pause, currentTime, duration } = useTypedSelector(state => state.playerReducer)
	const {
		playerSetActiveTrack,
		setDefaultTrackList } = useActions()

	const [deleteTrackMutation] = useDeleteTrackMutation()

	useEffect(() => {
		if (activeTrack !== track) {
			if (audio && activeTrack) {
				setAudio()
			}
		}
	}, [audio, activeTrack, track]);

	const handleDelete = async () => {
		if (track.id) {
			await deleteTrackMutation(track?.id).unwrap()
				.then(result => {
					console.log(`track with id${track.id} is delete`);
				})
				.catch(e => {
					console.log(`При удалении трека с id ${track.id} произошла ошибка \n ${e.message}`);
				})
		}
	}

	const handlePlayBtn = async () => {
		setDefaultTrackList(trackList)
		playerSetActiveTrack(track)
		playBtn()
	}

	const trackPicture = baseUrl + track.picture

	return (
		<div className={styles.track__container}>
			<div className={styles.main__info_container}>
				<div className={styles.playBtn_container}>
					<PlayPauseBtns onClick={handlePlayBtn} pause={pause} track={track} />
				</div>

				<img
					onClick={handleTrackClick}
					className={styles.cover}
					width={45}
					height={45}
					src={trackPicture}
					alt='cover'
				/>

				<div className={styles.info__track_container}>
					<p onClick={handleTrackClick} className={styles.name}>
						{track.name}
					</p>
					<p className={styles.artist}>
						{track.artist}
						{track.listens
							? (
								<span className={styles.listens}>
									{track.listens} {getListenWordForm(track.listens)}
								</span>
							)
							: (
								<span className={styles.listens}>
									0 {getListenWordForm(0)}
								</span>
							)
						}

					</p>
				</div>
			</div>
			<div className={styles.right__container}>
				<div className={styles.time__container}>
					{activeTrack?.name == track.name &&
						(
							<p className={styles.time}>
								<span className={styles.time_desktop}>
									{formatTime(currentTime)} /
								</span>
								{formatTime(duration)}
							</p>
						)}
				</div>
				<Image
					width={40}
					height={40}
					onClick={handleDelete}
					className={styles.delete_icon}
					src={delete_icon}
					alt="delete icon"
				/>
			</div>
		</div>
	)
}

export default withAudioPlayer(TrackItem);