import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";

/* Modules */
import { MatchModule } from './match/match.module';

/* Entities */
import { Team } from './entity/team.entity';
import { Match } from './entity/match.entity';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'leaguedb',
      entities: [Team, Match],
      synchronize: false,
    }),
    MatchModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
