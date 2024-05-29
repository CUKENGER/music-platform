import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TrackComment } from "./trackComment.schema";


@Entity()
export class TrackReplyComment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string

    @Column()
    text: string

    @Column()
    commentId: number

    @Column({nullable: true})
    createDate: Date

    @Column({default: 0})
    likes: number

    @ManyToOne(() => TrackComment, (comment) => comment.replies)
    comment: TrackComment;
}
