import { Injectable, Inject, CACHE_MANAGER, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Match } from "src/entity/match.entity";
import { Repository } from "typeorm";
import { Cache } from "cache-manager"

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match) private readonly matchRepository: Repository<Match>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async runActiveWeek() {
        const findActiveWeek = await this.matchRepository.findOne({ isPlayed: false }, {
            order: {
                week: "ASC"
            },
            select: ["week"]
        })
        if (!findActiveWeek) throw new HttpException('There is no match for run.', HttpStatus.BAD_REQUEST);
        await this.cacheManager.del("scoreboard");
        return this.runMatches(findActiveWeek.week);
    }

    async runMatches(week: number) {
        const findMatchesForWeek = await this.matchRepository.find({ where: { week }, relations: ["home", "away"] });
        findMatchesForWeek.forEach(async M => {
            M.awayGoal = this.randomGoal(6);
            M.homeGoal = this.randomGoal(6);
            M.winner = M.home.id;
            M.isPlayed = true;
            if (M.awayGoal > M.homeGoal) M.winner = M.away.id;
            if (M.awayGoal == M.homeGoal) { M.winner = 0; M.isDraw = true }
            await this.matchRepository.save(M);
        })
        return findMatchesForWeek;
    }

    randomGoal(max: number) {
        return Math.floor(Math.random() * max);
    }
}
