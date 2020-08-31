import { Publisher, OrderCreatedEvent, Subjects } from '@jrtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
