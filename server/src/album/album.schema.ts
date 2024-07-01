import { Track } from 'src/track/scheme/track.schema';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumComment } from './commentAlbum/albumComment.schema';
import { Artist } from 'src/artist/scheme/artist.schema';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  artist: string;

  @Column()
  artistId: number;

  @Column()
  genre: string;

  @Column({ default: 0 })
  listens: number;

  @Column({ default: 0 })
  likes: number;

  @Column()
  picture: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date'})
  releaseDate: Date;

  @Column({ type: 'date'})
  createdAt: Date;

  @Column({ type: 'date', nullable: true})
  updatedAt: Date;

  @Column()
  type: string

  @ManyToOne(() => Artist, artist => artist.albums)
  @JoinColumn({ name: 'artistId' }) 
  artistEntity: Artist;

  @OneToMany(() => AlbumComment, albumComment => albumComment.album)
  comments: AlbumComment[];

  @OneToMany(() => Track, track => track.album)
  tracks: Track[];
}
