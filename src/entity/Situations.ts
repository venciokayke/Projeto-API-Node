import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User } from "./Users";

@Entity("situations")
export class Situation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nameSituatiuon!: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    @OneToMany(() => User, (User) => User.situation)
    users!: User[]; 
}