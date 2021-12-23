import { Module, CacheModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as redisStore from "cache-manager-redis-store";
import { Match } from "src/entity/match.entity";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        TypeOrmModule.forFeature([Match]),
        CacheModule.register({
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: 6379
        })
    ],
    controllers: [MatchController],
    providers: [MatchService],
})

export class MatchModule {}
