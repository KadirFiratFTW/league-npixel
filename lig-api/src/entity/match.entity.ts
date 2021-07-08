import { ManyToOne, Index, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Team } from "./team.entity";

@Entity('matches')
export class Match {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Team, team => team.id)
    home: Team;

    @ManyToOne(() => Team, team => team.id)
    away: Team;


    @Column()
    homeGoal: number;

    @Column()
    awayGoal: number;

    @Index()
    @Column()
    week: number;

    @Index()
    @Column()
    winner: number;

    @Index()
    @Column({ default: false })
    isDraw: boolean;

    @Column({ default: false })
    isPlayed: boolean

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}