import { Track } from './track.schema';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string

    @Column()
    text: string

    @ManyToOne(() => Track, (track) => track.comments)
    track: Track;
}
