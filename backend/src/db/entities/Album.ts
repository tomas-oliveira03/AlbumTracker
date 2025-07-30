import { Check, Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { Track } from "./Track";
import { AlbumArtist } from "./AlbumArtist";

@Entity()
export class Album {
    
    @PrimaryColumn({ type: 'varchar' })
    id!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'int' })
    totalTracks!: number;

    @Column({ type: 'varchar' })
    type!: SpotifyApi.AlbumObjectSimplified['album_type']

    @Column({ type: 'date' })
    releaseDate!: Date;

    @Column({ type: 'varchar' })
	externalURL!: string;

    @Column({ type: 'varchar' })
	imageURL!: string;

    @Column({ type: 'jsonb' })
	detailedData!: SpotifyApi.SingleAlbumResponse;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    // Relations
    @OneToMany(() => Track, (track) => track.album)
    tracks!: Track[];

    @OneToMany(() => AlbumArtist, (albumArtist) => albumArtist.album)
    artistLinks!: AlbumArtist[];
}
