import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { Album } from "./Album";
import { SpotifyCustomTrack } from "@/server/schemas/spotify";

@Entity()
export class Track {

    @PrimaryColumn({ type: 'varchar' })
    id!: string;

    @Column({ type: 'varchar' })
	albumId!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'int' })
    duration!: number;

    @Column({ type: 'varchar' })
	externalURL!: string;

    @Column({ type: 'jsonb' })
	detailedData!: SpotifyCustomTrack

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    // Relations
    @ManyToOne(() => Album)
    album!: Album;
}
