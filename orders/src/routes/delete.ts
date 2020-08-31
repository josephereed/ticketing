import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/orderModel';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@jrtickets/common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;

    await order.save();

    // Publishing an event saying this is cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: orderId,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
