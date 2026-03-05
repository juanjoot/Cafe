export const RABBITMQ_EXCHANGE = 'coffee.topic';

export const ROUTING_KEYS = {
  ORDER_CREATED: 'order.created',
  INVENTORY_RESERVE: 'inventory.reserve',
  INVENTORY_RESERVED: 'inventory.reserved',
  INVENTORY_REJECTED: 'inventory.rejected',
  PAYMENT_PROCESS: 'payment.process',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  SHIPPING_CREATE: 'shipping.create',
  SHIPPING_CREATED: 'shipping.created',
} as const;