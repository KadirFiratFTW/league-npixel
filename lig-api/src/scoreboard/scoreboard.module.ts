import { Module, CacheModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as redisStore from "cache-manager-redis-store";
import { ScoreBoardController } from "./scoreboard.controller";
import { ScoreBoardService } from "./scoreboard.service";
import { Team } from "src/entity/team.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Team]),
        CacheModule.register({
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: 6379
        })
    ],
    controllers: [ScoreBoardController],
    providers: [ScoreBoardService],
})

export class ScoreBoardModule {}
