import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
  await request(app)
    .get('/api/tickets/inwerjinjrwe')
    .send()
    .expect(404);
});

it('returns a 400 if ticketId was invalid', async () => {
  const ticketId = 'dfkgnlknglkenglketg';
 
  await request(app).get(`/api/tickets/${ticketId}`).expect(400);
});

it('returns a valid ticket if the ticket is found', async () => {
  const title = 'testname';
  const price = 10;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const { id } = response.body;
  const ticketResponse = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(200);
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
