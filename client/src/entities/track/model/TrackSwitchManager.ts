import { ITrack } from '../types/Track';
import audioManager from './AudioManager';

interface TrackSwitchManagerProps {
  activeTrack: ITrack | null;
  activeTrackList: ITrack[] | null;
  setActiveTrack: (track: ITrack) => void;
  setPlay: () => void;
}

class TrackSwitchManager {
  private static instance: TrackSwitchManager;
  private props: TrackSwitchManagerProps | null = null;

  private constructor() {
    audioManager.setTrackSwitchCallback({
      onTrackEnded: this.handleTrackEnded,
    });
  }

  public static getInstance(): TrackSwitchManager {
    if (!TrackSwitchManager.instance) {
      TrackSwitchManager.instance = new TrackSwitchManager();
    }
    return TrackSwitchManager.instance;
  }

  private handleTrackEnded = () => {
    if (this.props) {
      this.switchTrack(true, this.props);
    } else {
      console.warn('TrackSwitchManager: Нет props для автоматического переключения');
    }
  };

  public setProps(props: TrackSwitchManagerProps) {
    this.props = { ...props };
  }

  public async switchTrack(isNext: boolean, props: TrackSwitchManagerProps): Promise<void> {
    this.setProps(props);

    const { activeTrack, activeTrackList, setActiveTrack, setPlay } = props;

    if (!activeTrackList || !activeTrack) {
      console.warn('TrackSwitchManager: Нет активного списка треков или трека');
      return;
    }

    const currentIndex = activeTrackList.findIndex((track) => track.id === activeTrack.id);
    const nextIndex =
      isNext ?
        (currentIndex + 1) % activeTrackList.length
      : (currentIndex - 1 + activeTrackList.length) % activeTrackList.length;

    const nextTrack = activeTrackList[nextIndex];
    if (nextTrack) {
      setActiveTrack(nextTrack);
      this.setProps({
        activeTrack: nextTrack,
        activeTrackList,
        setActiveTrack,
        setPlay,
      });
      try {
        const url = `/api/${nextTrack.audio}/master.m3u8`;
        await audioManager.loadHlsSource(url);
        setPlay();
      } catch (err) {
        console.error('TrackSwitchManager: Ошибка воспроизведения:', err);
      }
    } else {
      console.warn('TrackSwitchManager: Следующий трек не найден');
    }
  }
}

export default TrackSwitchManager.getInstance();
