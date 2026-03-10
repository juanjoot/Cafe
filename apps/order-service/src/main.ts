import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);
  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RABBITMQ_URL')],
      queue: 'order-service.q',
      queueOptions: { durable: true },
      noAck: false,
      prefetchCount: 10,
    },
  });

  await app.startAllMicroservices();
  console.log('order-service is listening (RMQ)');
}
bootstrap();
