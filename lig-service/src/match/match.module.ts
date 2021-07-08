import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "src/entity/match.entity";
import { Team } from "src/entity/team.entity";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Team, Match])
    ],
    controllers: [MatchController],
    providers: [MatchService],
})

export class MatchModule {

}