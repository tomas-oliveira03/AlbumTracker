import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Track {

    @PrimaryColumn({ type: 'varchar' })
    id!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'int' })
    duration!: number;

    @Column({ type: 'varchar' })
	externalURL!: string;

    @Column({ type: 'jsonb' })
	detailedData!: Record<string, any>;
}
