import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderMessageController } from './controllers/order-message.controller';
import { OrderEventsController } from './controllers/order-events.controller';
import { OrdersService } from './services/orders.service';

import { Order, OrderSchema } from './schemas/order.schema';

// import relativo a tu lib common
import { RabbitMQModule } from '../../../libs/common/src';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('ORDER_MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),

    // cliente para emitir a inventory-service
    RabbitMQModule.register('inventory-service'),
  ],
  controllers: [OrderMessageController, OrderEventsController],
  providers: [OrdersService],
})
export class OrderServiceModule {}