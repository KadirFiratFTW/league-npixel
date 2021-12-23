import { Inject, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "src/entity/team.entity";
import { Repository } from "typeorm";

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
        @Inject('LEAGUE_SERVICE') private readonly clientMQ: ClientProxy
    ) {}
    
    async all(): Promise<Team[]> {
        return this.teamRepository.find();
    }

    async create(data): Promise<Team> {
        const countTeams = await this.teamRepository.count();
        if (countTeams > 17) {
            this.clientMQ.emit('generateMatches', true);
            throw new HttpException('You cant add team more than 18 teams.', HttpStatus.BAD_REQUEST)
        }
        return this.teamRepository.save(data);
    }

    async getOne(data): Promise<Team> {
        return this.teamRepository.findOne(data);
    }

}
