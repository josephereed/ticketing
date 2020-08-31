import { Subjects, Publisher, ExpirationCompleteEvent } from '@jrtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}