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

    @Column({ type: 'date'})
    createdAt: Date;

    @Column({ type: 'date'})
    updatedAt: Date;

    @ManyToOne(() => Artist, (artist) => artist.comments)
    @JoinColumn({ name: 'artistId' })
    artist: Artist;
}
