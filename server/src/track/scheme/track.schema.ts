
import { Document } from 'mongoose';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {Comment} from '../scheme/comment.schema';

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
}
