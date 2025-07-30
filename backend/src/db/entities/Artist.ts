import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { AlbumArtist } from "./AlbumArtist";
import { TrackArtist } from "./TrackArtist";

@Entity()
export class Artist {

    @PrimaryColumn({ type: 'varchar' })
	id!: string;

    @Column({ type: 'varchar' })
	name!: string;

    @Column({ type: 'varchar' })
	externalURL!: string;

    @Column({ type: 'varchar' })
	imageURL!: string;

    @Column({ type: 'jsonb' })
	detailedData!: SpotifyApi.SingleArtistResponse;

    // Indicates whether the artist's albums have already been fetched from the Spotify API
    // Edge case: Artists with no albums will still be marked as scanned to avoid unnecessary future lookups.
    @Column({ type: 'boolean', default: false })
	albumsScanned !: boolean;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    // Relations
    @OneToMany(() => AlbumArtist, (albumArtist) => albumArtist.artist)
    albumLinks!: AlbumArtist[];

    @OneToMany(() => TrackArtist, (trackArtist) => trackArtist.artist)
    trackLinks!: TrackArtist[];
}
