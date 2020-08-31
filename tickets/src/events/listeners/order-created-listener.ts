import { Listener, OrderCreatedEvent, Subjects } from '@jrtickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticketModel';
import { queueGroupName } from './queueGroupName';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // Mark the ticket as being reserved
    ticket.set({ orderId: data.id });
    // Save the ticket
    await ticket.save();

    // publish ticket update
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      version: ticket.version,
      title: ticket.title,
      orderId: ticket.orderId,
      userId: ticket.userId,
    });
    // ack the message
    msg.ack();
  }
}
