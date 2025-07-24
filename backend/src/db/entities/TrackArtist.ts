import { Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { Artist } from "./Artist";
import { Track } from "./Track";

@Entity()
export class TrackArtist {
    @PrimaryColumn({ type: 'varchar' })
    trackId!: string;

    @PrimaryColumn({ type: 'varchar' })
    artistId!: string;

    @ManyToOne(() => Track)
    track!: Track;

    @ManyToOne(() => Artist)
    artist!: Artist;
}
