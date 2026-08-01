import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'room_players' })
export class RoomPlayer {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    room_id!: string;

    @Column({ nullable: true })
    user_id!: string;

    @Column({ default: false })
    is_owner!: boolean;

    @Column({ type: 'varchar' })
    player_name!: string;

    @Column({ type: 'boolean', default: true })
    activate!: Boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}