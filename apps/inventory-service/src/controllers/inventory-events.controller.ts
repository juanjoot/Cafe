import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

import { InventoryService } from '../services/inventory.service';
// import relativo a tu lib common
import { ROUTING_KEYS } from '../../../../libs/common/src';
import type { BaseMessage } from '../../../../libs/common/src';

@Controller()
export class InventoryEventsController {
  constructor(
    private readonly inventory: InventoryService,
    @Inject('order-service') private readonly orderClient: ClientProxy,
  ) {}

  @EventPattern(ROUTING_KEYS.INVENTORY_RESERVE)
  async handleReserve(
    @Payload() msg: BaseMessage<{ orderId: string; items: { productId: string; qty: number }[] }>
  ) {
    const result = await this.inventory.reserve(msg.data.items);

    if (result.ok) {
      this.orderClient.emit(ROUTING_KEYS.INVENTORY_RESERVED, {
        eventId: randomUUID(),
        correlationId: msg.correlationId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: { orderId: msg.data.orderId },
      });
    } else {
      this.orderClient.emit(ROUTING_KEYS.INVENTORY_REJECTED, {
        eventId: randomUUID(),
        correlationId: msg.correlationId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: { orderId: msg.data.orderId, reason: result.reason },
      });
    }
  }
}