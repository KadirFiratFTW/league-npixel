import { Controller, Get } from "@nestjs/common";
import { MatchService } from "./match.service";
@Controller('matches')
export class MatchController {

    constructor(
        private matchService: MatchService,
    ) {

    }

    @Get("run")
    async run() {
        return this.matchService.runActiveWeek();
    }


}