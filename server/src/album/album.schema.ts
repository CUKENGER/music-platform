
import { Document } from 'mongoose';
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

  @Column({nullable: true})
  artistId: number;

  @Column({nullable: true})
  genre: string;

  @Column({default:0})
  listens: number;

  @Column({default:0})
  likes: number;

  @Column({nullable: true})
  picture: string;

  @Column({nullable: true})
  description: string;

  @Column({type: 'date', nullable: true})
  releaseDate: Date;

  @ManyToOne(() => Artist, artist => artist.albums)
  @JoinColumn({ name: 'artistId' }) 
  artistEntity: Artist;

  @OneToMany(() => AlbumComment, albumComment => albumComment.album, {nullable: true})
  comments: AlbumComment[];

  @OneToMany(() => Track, track => track.album, {nullable: true})
  tracks: Track[];
}
