import { NestFactory } from '@nestjs/core';
import { ProductServiceModule } from './product-service.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ProductServiceModule);
  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RABBITMQ_URL')],
      queue: 'product-service.q',
      queueOptions: { durable: true },
      noAck: false,
      prefetchCount: 10,
    },
  });

  await app.startAllMicroservices();
  console.log('product-service is listening (RMQ)');
}
bootstrap();
