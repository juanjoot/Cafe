export interface BaseMessage<T> {
  eventId: string;
  correlationId: string;
  timestamp: string;
  version: number;
  data: T;
}
