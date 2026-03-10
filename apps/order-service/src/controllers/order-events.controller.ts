import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrdersService } from '../services/orders.service';

// import relativo a tu lib common
import { ROUTING_KEYS } from '../../../../libs/common/src';
import type { BaseMessage } from '../../../../libs/common/src';

@Controller()
export class OrderEventsController {
  constructor(private readonly orders: OrdersService) {}

  @EventPattern(ROUTING_KEYS.INVENTORY_RESERVED)
  async onInventoryReserved(
    @Payload() msg: BaseMessage<{ orderId: string }>
  ) {
    await this.orders.setStatus(msg.data.orderId, 'INVENTORY_RESERVED');
  }

  @EventPattern(ROUTING_KEYS.INVENTORY_REJECTED)
  async onInventoryRejected(
    @Payload() msg: BaseMessage<{ orderId: string; reason?: string }>
  ) {
    await this.orders.setStatus(msg.data.orderId, 'CANCELLED');
  }
}