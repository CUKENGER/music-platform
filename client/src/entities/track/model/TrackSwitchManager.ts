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
    console.log('TrackSwitchManager: Автоматическое переключение на следующий трек');
    if (this.props) {
      console.log('TrackSwitchManager: Используемые props для переключения', {
        activeTrack: this.props.activeTrack?.name,
        activeTrackList: this.props.activeTrackList?.map((t) => t.name),
      });
      this.switchTrack(true, this.props);
    } else {
      console.warn('TrackSwitchManager: Нет props для автоматического переключения');
    }
  };

  public setProps(props: TrackSwitchManagerProps) {
    console.log('TrackSwitchManager: Обновление props', {
      activeTrack: props.activeTrack?.name,
      activeTrackList: props.activeTrackList?.map((t) => t.name),
    });
    this.props = { ...props };
  }

  public async switchTrack(isNext: boolean, props: TrackSwitchManagerProps): Promise<void> {
    // Обновляем this.props перед переключением
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
      console.log(
        `TrackSwitchManager: Переключаем на трек ${nextTrack.name} (индекс: ${nextIndex})`,
      );
      setActiveTrack(nextTrack);
      try {
        const url = `/api/${nextTrack.audio}/master.m3u8`;
        console.log(`TrackSwitchManager: Загружаем URL: ${url}`);
        await audioManager.loadHlsSource(url);
        console.log(`TrackSwitchManager: Трек ${nextTrack.name} успешно загружен`);
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
