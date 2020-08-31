import { Subjects, Publisher, PaymentCreatedEvent } from '@jrtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}