import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


enum RoomStatus {
    WAITING = 'waiting',
    PLAYING = 'playing',
    FINISHED = 'finished',
}

@Entity({ name: 'rooms' })
export class Room {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', unique: true })
    pincode!: string;

    @Column()
    category_id!: string;

    @Column({ type: 'int', default: 60 })
    minutes!: number;

    @Column({ type: 'varchar', length: 10, default: 'en' })
    locale!: string;

    @Column({ type: 'varchar', default: RoomStatus.WAITING })
    status!: RoomStatus

    @Column({ type: 'boolean', default: true })
    activate!: Boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}