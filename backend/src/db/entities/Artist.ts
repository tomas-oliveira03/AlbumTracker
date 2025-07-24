import { Column, Entity, PrimaryColumn } from "typeorm"

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
}
