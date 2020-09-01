import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@jrtickets/common';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(createOrderRouter);


app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
