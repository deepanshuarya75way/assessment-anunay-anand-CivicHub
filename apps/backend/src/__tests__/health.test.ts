import request from 'supertest';
import { app } from '../app';
import mongoose from 'mongoose';

describe('Health Endpoints', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 200 OK for /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Service is healthy');
    expect(res.body.data.status).toBe('ok');
  });

  it('should return 200 OK for /health/live', async () => {
    const res = await request(app).get('/health/live');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('uptime');
  });
});
