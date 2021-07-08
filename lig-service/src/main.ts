import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbit:password@' + process.env.RABBITMQ_HOST],
      queue: 'MATCH_QUEUE',
      queueOptions: {
        durable: false
      },
    },
  });

  app.listen(() => {
    console.log("Services started.")
  })
}
bootstrap();
