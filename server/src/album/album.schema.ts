
import { Document } from 'mongoose';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  artist: string;

  @Column()
  tracks: Track[];

  @Column()
  listens: number;

  @Column()
  picture: string;

  @Column()
  audio: string;
}
