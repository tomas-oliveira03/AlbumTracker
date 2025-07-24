import { Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { Album } from "./Album";
import { Artist } from "./Artist";

@Entity()
export class AlbumArtist {
    @PrimaryColumn({ type: 'varchar' })
    albumId!: string;

    @PrimaryColumn({ type: 'varchar' })
    artistId!: string;

    @ManyToOne(() => Album)
    album!: Album;

    @ManyToOne(() => Artist)
    artist!: Artist;
}
