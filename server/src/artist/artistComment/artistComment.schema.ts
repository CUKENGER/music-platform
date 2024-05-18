import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Artist } from "../scheme/artist.schema";


@Entity()
export class ArtistComment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string

    @Column()
    text: string

    @Column()
    artistId: number

    @ManyToOne(() => Artist, (artist) => artist.comments)
    @JoinColumn({ name: 'artistId' })
    artist: Artist;
}
