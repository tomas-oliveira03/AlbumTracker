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
	detailedData!: Record<string, any>;

    // Relations
    @OneToMany(() => AlbumArtist, (albumArtist) => albumArtist.artist)
    albumLinks!: AlbumArtist[];

    @OneToMany(() => TrackArtist, (trackArtist) => trackArtist.artist)
    trackLinks!: TrackArtist[];
}
