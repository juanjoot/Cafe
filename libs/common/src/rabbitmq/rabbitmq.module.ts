import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class RabbitMQModule {
  static register(clientName: string): DynamicModule {
    return {
      module: RabbitMQModule,
      imports: [
        ConfigModule,
        ClientsModule.registerAsync([
          {
            name: clientName,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [config.getOrThrow<string>('RABBITMQ_URL')],
                queue: `${clientName}.q`,
                queueOptions: { durable: true },
              },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}