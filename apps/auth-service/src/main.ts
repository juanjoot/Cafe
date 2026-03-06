import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RABBITMQ_URL')],
      queue: 'auth-service.q',
      queueOptions: { durable: true },
      noAck: false,
      prefetchCount: 10,
    },
  });

  await app.startAllMicroservices();
  console.log('auth-service microservice is listening (RMQ)');
}
bootstrap();
