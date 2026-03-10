import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, StockDocument } from '../schemas/stock.schema';

@Injectable()
export class InventoryService {
  constructor(@InjectModel(Stock.name) private readonly stockModel: Model<StockDocument>) {}

  async reserve(items: { productId: string; qty: number }[]) {
    // MVP: reserva “optimista” en serie. (Luego lo mejoramos con transacciones o atomic ops)
    for (const item of items) {
      const stock = await this.stockModel.findOne({ productId: item.productId }).exec();
      if (!stock || stock.available < item.qty) {
        return { ok: false, reason: `Insufficient stock for product ${item.productId}` };
      }
    }

    // descontar
    for (const item of items) {
      await this.stockModel.updateOne(
        { productId: item.productId },
        { $inc: { available: -item.qty } },
      ).exec();
    }

    return { ok: true };
  }
}