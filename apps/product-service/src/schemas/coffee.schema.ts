import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CoffeeDocument = HydratedDocument<Coffee>;

@Schema({ timestamps: true })
export class Coffee {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  origin: string;

  @Prop({ type: [String], default: [] })
  tastingNotes: string[];

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ default: true })
  active: boolean;

  // ✅ Tipado para timestamps (generados por Mongoose)
  createdAt?: Date;
  updatedAt?: Date;
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffee);
