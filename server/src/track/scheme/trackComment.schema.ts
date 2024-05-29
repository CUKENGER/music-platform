import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Track } from "../scheme/track.schema";
import { TrackReplyComment } from "./trackReplyComment.schema";


@Entity()
export class TrackComment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string

    @Column()
    text: string

    @Column()
    trackId: number

    @Column({nullable: true})
    createDate: Date

    @Column({default: 0})
    likes: number

    @ManyToOne(() => Track, (track) => track.comments)
    track: Track;

    @OneToMany(() => TrackReplyComment, (reply) => reply.comment)
    replies: TrackReplyComment[]
}
