import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { Album } from "./Album";

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
	detailedData!: Record<string, any>;

    // Relations
    @ManyToOne(() => Album)
    album!: Album;
}
