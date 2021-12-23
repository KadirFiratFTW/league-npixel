import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { MatchService } from "./match.service";

@Controller('matches')
export class MatchController {
    constructor(private matchService: MatchService) {}

    @EventPattern('generateMatches')
    async generateMatches(data: boolean) {
        this.matchService.createMatches()
    }
}
