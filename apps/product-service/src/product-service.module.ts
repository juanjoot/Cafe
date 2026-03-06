import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductMessageController } from './controllers/product-message.controller';
import { ProductsService } from './services/products.service';
import { Coffee, CoffeeSchema } from './schemas/coffee.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('PRODUCT_MONGO_URI'),
      }),
    }),

    MongooseModule.forFeature([{ name: Coffee.name, schema: CoffeeSchema }]),
  ],
  controllers: [ProductMessageController],
  providers: [ProductsService],
})
export class ProductServiceModule {}
