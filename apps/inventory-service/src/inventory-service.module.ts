import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { InventoryEventsController } from './controllers/inventory-events.controller';
import { InventoryService } from './services/inventory.service';
import { Stock, StockSchema } from './schemas/stock.schema';

// import relativo a tu lib common
import { RabbitMQModule } from '../../../libs/common/src';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('INVENTORY_MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),

    // cliente para emitir eventos de vuelta a order-service
    RabbitMQModule.register('order-service'),
  ],
  controllers: [InventoryEventsController],
  providers: [InventoryService],
})
export class InventoryServiceModule {}
