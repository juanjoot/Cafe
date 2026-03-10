import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StockDocument = HydratedDocument<Stock>;

@Schema({ timestamps: true })
export class Stock {
  @Prop({ required: true, unique: true })
  productId: string;

  @Prop({ required: true, min: 0, default: 0 })
  available: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const StockSchema = SchemaFactory.createForClass(Stock);