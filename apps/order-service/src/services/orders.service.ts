import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {}

  async create(userId: string, items: { productId: string; qty: number; unitPrice: number }[]) {
    const total = items.reduce((acc, i) => acc + i.qty * i.unitPrice, 0);

    const created = new this.orderModel({
      userId,
      items,
      total,
      status: 'PENDING_INVENTORY' as OrderStatus,
    });

    const saved = await created.save();
    return this.toPublic(saved);
  }

  async setStatus(orderId: string, status: OrderStatus) {
    const updated = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true }).exec();
    if (!updated) throw new Error('Order not found');
    return this.toPublic(updated);
  }

  async findById(orderId: string) {
    const doc = await this.orderModel.findById(orderId).exec();
    if (!doc) throw new Error('Order not found');
    return this.toPublic(doc);
  }

  private toPublic(doc: OrderDocument) {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      items: doc.items,
      total: doc.total,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}