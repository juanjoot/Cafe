import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ProductsController } from './products.controller';
import { JwtStrategy } from './auth/jwt.strategy';

import { RabbitMQModule } from '../../../libs/common/src';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    // Cliente RMQ que publica al queue del auth-service
    RabbitMQModule.register('auth-service'),
    RabbitMQModule.register('product-service'),
  ],
  controllers: [AuthController, ProductsController],
  providers: [JwtStrategy],
})
export class ApiGatewayModule {}
