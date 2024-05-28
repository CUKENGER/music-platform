import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Album } from 'src/album/album.schema';
import { Artist } from 'src/artist/scheme/artist.schema';
import { TrackComment } from './trackComment.schema';


@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  artist: string;

  @Column({ default: 0})
  listens: number;

  @Column({ default: 0})
  likes: number;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  audio: string;

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  artistId: number;

  @Column({ nullable: true })
  albumId: number;

  @ManyToOne(() => Artist, artist => artist.tracks)
  @JoinColumn({ name: 'artistId' })
  artistEntity: Artist;

  @OneToMany(() => TrackComment, comment => comment.track)
  comments: TrackComment[];

  @ManyToOne(() => Album, album => album.tracks)
  @JoinColumn({ name: 'albumId' })
  album: Album;
}
