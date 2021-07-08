import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "src/entity/team.entity";
import { Match } from "src/entity/match.entity";
import { Repository } from "typeorm";
import * as lodash from "lodash";


@Injectable()
export class MatchService {


    constructor(
        @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
        @InjectRepository(Match) private readonly matchRepository: Repository<Match>
    ) {

    }

    async createMatches(): Promise<Team> {
        const matchCount = await this.matchRepository.count();

        if (matchCount) return;
        this.generateFirstMatches();
    }

    async generateFirstMatches() {

        const teams = await this.teamRepository.find();
        const randomTeams = lodash.shuffle(teams);
        let cacheMatches = [];
        randomTeams.forEach(T => {
            const filterOtherTeams = teams.filter(Team => Team.id !== T.id);
            const shuffleTeams = lodash.shuffle(filterOtherTeams);
            shuffleTeams.forEach(AwayTeam => {
                const hasMatch = cacheMatches.find(M => (M.Home == AwayTeam.id && M.Away == T.id) || (M.Home == T.id && M.Away == AwayTeam.id));
                if (hasMatch) return;
                cacheMatches.push({ Home: T.id, Away: AwayTeam.id });
            })
        })

        this.shuffleMatches(cacheMatches);

    }

    shuffleMatches(matches) {
        let matchWeek = 0;
        let matchCounter = 0;
        matches = lodash.shuffle(matches);
        matches = matches.map(M => {
            if (matchCounter % 9 == 0) matchWeek++;
            matchCounter++;
            return { Home: M.Home, Away: M.Away, matchWeek }
        })
        this.generateSecondMatches(matches);
    }

    generateSecondMatches(firstMatches) {

        const secondMatches = [];
        let matchWeek = 17;
        firstMatches.forEach(M => {
            if (secondMatches.length % 9 == 0) matchWeek++;
            secondMatches.push({ Home: M.Away, Away: M.Home, matchWeek });
        })
        this.insertMatches([...firstMatches, ...secondMatches]);

    }

    insertMatches(matchList) {
        matchList.forEach(async M => {
            const newMatch = new Match();
            newMatch.home = M.Home;
            newMatch.away = M.Away;
            newMatch.week = M.matchWeek;
            await this.matchRepository.save(newMatch);
        })

        console.log("Fixture Generated.")
    }

}