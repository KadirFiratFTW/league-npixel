import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Team } from "src/entity/team.entity";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        TypeOrmModule.forFeature([Team]),
        ClientsModule.register([
            {
                name: "LEAGUE_SERVICE",
                transport: Transport.RMQ,
                options: {
                    urls: ["amqp://rabbit:password@" + process.env.RABBITMQ_HOST],
                    queue: "MATCH_QUEUE",
                    queueOptions: {
                        durable: false
                    }
                }
            }
        ])
    ],
    controllers: [TeamController],
    providers: [TeamService],
})

export class TeamModule {}
