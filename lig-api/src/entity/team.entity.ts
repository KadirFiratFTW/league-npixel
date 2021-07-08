import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Match } from "./match.entity";
@Entity('teams')
export class Team {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    teamName: string;

}