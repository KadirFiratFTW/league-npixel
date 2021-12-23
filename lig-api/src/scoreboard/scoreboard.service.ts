import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Team } from "src/entity/team.entity";
import { Match } from "src/entity/match.entity";

@Injectable()
export class ScoreBoardService {
    constructor(
        @InjectRepository(Team) private readonly teamRepository: Repository<Team>
    ) {}

    async getScoreBoard() {
        const ScoreBoard = await this.teamRepository.createQueryBuilder("teams")
            .leftJoinAndSelect(Match, "match", "match.awayId = teams.id OR match.homeId = teams.id")
            .select(["teams.teamName as teamName"])
            .addSelect("COUNT(match.id)", "matchCount")
            .addSelect("COALESCE(SUM(CASE WHEN match.isPlayed = true AND match.winner = teams.id THEN 1 ELSE 0 END), 0) wins")
            .addSelect("COALESCE(SUM(CASE WHEN match.isPlayed = true AND match.isDraw = true THEN 1 ELSE 0 END), 0) draws")
            .addSelect("COALESCE(SUM(CASE WHEN match.isPlayed = true AND match.winner != teams.id AND match.isDraw = false THEN 1 ELSE 0 END), 0) loses")
            .addSelect("COALESCE(SUM(CASE WHEN match.isPlayed = true AND match.homeId = teams.id THEN match.homeGoal ELSE match.awayGoal END), 0) goals")
            .addSelect("COALESCE(SUM(CASE WHEN match.isPlayed = true AND match.homeId != teams.id THEN match.homeGoal ELSE match.awayGoal END), 0) egoals")
            .groupBy("teams.id")
            .getRawMany();
        return this.calculatePoints(ScoreBoard);
    }

    calculatePoints(scores) {
        scores.forEach(S => {
            S.points = (S.wins * 3) + (parseInt(S.draws))
            S.average = S.goals - S.egoals
        })
        return this.calculateRanks(scores);
    }

    calculateRanks(scores) {
        let Rank = 0;
        const rankedBoard = scores.sort((a, b) => {
            return b.points - a.points || b.average - a.average;
        }).map(R => {
            Rank++;
            return { ...R, Rank }
        })
        return rankedBoard;
    }
}
