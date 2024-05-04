

import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {Comment} from '../scheme/comment.schema';
import { Album } from 'src/album/album.schema';

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  artist: string;

  @Column()
  listens: number;

  @Column({nullable: true})
  picture: string;

  @Column({nullable: true})
  audio: string;

  @Column()
  text: string;

  @OneToMany(() => Comment, comment => comment.track)
  comments: Comment[];

  @ManyToOne(() => Album, album => album.tracks, { nullable: true })
  album: Album | null;
}
