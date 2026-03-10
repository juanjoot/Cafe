import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ProductsController } from './products.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { OrdersController } from './orders.controller';
import { RabbitMQModule } from '../../../libs/common/src';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    // Cliente RMQ que publica al queue del auth-service
    RabbitMQModule.register('auth-service'),
    RabbitMQModule.register('product-service'),
    RabbitMQModule.register('order-service'),
  ],
  controllers: [AuthController, ProductsController, OrdersController],
  providers: [JwtStrategy],
})
export class ApiGatewayModule {}
