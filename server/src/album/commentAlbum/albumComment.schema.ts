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

    @ManyToOne(() => Album, (album) => album.comments)
    album: Album;
}
