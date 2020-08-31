import { Publisher, OrderCancelledEvent, Subjects } from '@jrtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
