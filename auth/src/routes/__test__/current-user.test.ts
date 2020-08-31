import request from 'supertest';
import { app } from '../../app';

it('responds about details from the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null for unauthenticated requests', async () => {
  const response = await request(app).get('/api/users/current-user').send().expect(200);

  expect(response.body.currentUser).toEqual(null);
});
