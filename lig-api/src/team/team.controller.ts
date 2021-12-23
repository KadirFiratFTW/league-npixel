import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TeamService } from "./team.service";
@Controller('teams')
export class TeamController {
    constructor(private teamService: TeamService) { }

    @Get("all")
    async all() {
        return this.teamService.all();
    }

    @Post("new")
    async create(@Body("teamName") teamName: string) {
        return this.teamService.create({ teamName })
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        return this.teamService.getOne({ id })
    }
}
