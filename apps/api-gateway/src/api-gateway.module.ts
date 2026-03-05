import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '../../../libs/common/src';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Cliente RMQ que publica al queue del auth-service
    RabbitMQModule.register('auth-service'),
  ],
  controllers: [AuthController],
})
export class ApiGatewayModule {}