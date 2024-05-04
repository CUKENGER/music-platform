
import { Document } from 'mongoose';
import { Track } from 'src/track/scheme/track.schema';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumComment } from './commentAlbum/albumComment.schema';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  artist: string;

  @Column({nullable: true})
  listens: number;

  @Column({nullable: true})
  picture: string;

  @Column({nullable: true})
  description: string;

  @Column()
  releaseDate: string;

  @OneToMany(() => AlbumComment, albumComment => albumComment.album, {nullable: true})
  comments: AlbumComment[];

  @OneToMany(() => Track, track => track.album, {nullable: true})
  tracks: Track[];
}
