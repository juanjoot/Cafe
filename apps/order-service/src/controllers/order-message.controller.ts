import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { OrdersService } from '../services/orders.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

// import relativo a tu lib common
import { ROUTING_KEYS } from '../../../../libs/common/src';

@Controller()
export class OrderMessageController {
  constructor(
    private readonly orders: OrdersService,
    @Inject('inventory-service') private readonly inventoryClient: ClientProxy,
  ) {}

  @MessagePattern('order.create')
  async create(dto: { userId: string; items: { productId: string; qty: number; unitPrice: number }[] }) {
    try {
      const order = await this.orders.create(dto.userId, dto.items);

      // Emitimos comando a inventory-service para reservar stock
      const correlationId = randomUUID();
      this.inventoryClient.emit(ROUTING_KEYS.INVENTORY_RESERVE, {
        eventId: randomUUID(),
        correlationId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          orderId: order.id,
          items: order.items.map((i: any) => ({ productId: i.productId, qty: i.qty })),
        },
      });

      // Devuelve la orden creada (en estado PENDING_INVENTORY)
      return order;
    } catch (e: any) {
      throw new RpcException(e?.message ?? 'order.create failed');
    }
  }

  @MessagePattern('order.findById')
  async findById(dto: { id: string }) {
    try {
      return await this.orders.findById(dto.id);
    } catch (e: any) {
      throw new RpcException(e?.message ?? 'order.findById failed');
    }
  }
}