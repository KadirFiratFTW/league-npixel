import { Controller, Get, CACHE_MANAGER, Inject } from "@nestjs/common";
import { ScoreBoardService } from "./scoreboard.service";
import { Cache } from "cache-manager"

@Controller('scoreboard')
export class ScoreBoardController {
    constructor(
        private scoreBoardService: ScoreBoardService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    @Get()
    async getScoreboard() {
        const redisCheck = await this.cacheManager.get("scoreboard")
        if (redisCheck) return { "from": "cache", data: redisCheck };
        const fetchScoreboard = await this.scoreBoardService.getScoreBoard();
        await this.cacheManager.set("scoreboard", fetchScoreboard, {
            ttl: 300
        })
        return { "from": "db", "data": fetchScoreboard };
    }
}
