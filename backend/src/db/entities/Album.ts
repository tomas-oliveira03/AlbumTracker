import { Check, Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { Track } from "./Track";
import { AlbumArtist } from "./AlbumArtist";

export enum AlbumType {
    ALBUM = 'album',
    SINGLE = 'single',
    COMPILATION = 'compilation'
}

@Entity()
@Check(`"type" IN ('album', 'single', 'compilation')`)
export class Album {
    
    @PrimaryColumn({ type: 'varchar' })
    id!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'int' })
    totalTracks!: number;

    @Column({ type: 'varchar' })
    type!: AlbumType;

    @Column({ type: 'date' })
    releaseDate!: Date;

    @Column({ type: 'varchar' })
	externalURL!: string;

    @Column({ type: 'varchar' })
	imageURL!: string;

    @Column({ type: 'jsonb' })
	detailedData!: Record<string, any>;

    // Relations
    @OneToMany(() => Track, (track) => track.album)
    tracks!: Track[];

    @OneToMany(() => AlbumArtist, (albumArtist) => albumArtist.album)
    artistLinks!: AlbumArtist[];
}
