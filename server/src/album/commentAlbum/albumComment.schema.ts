import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "../album.schema";


@Entity()
export class AlbumComment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string

    @Column()
    text: string

    @Column()
    albumId: number

    @Column({ type: 'date'})
    createdAt: Date;

    @Column({ type: 'date'})
    updatedAt: Date;

    @ManyToOne(() => Album, (album) => album.comments)
    album: Album;
}
