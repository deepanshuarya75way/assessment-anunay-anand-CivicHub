import request from 'supertest';
import { app } from '../app';
import mongoose from 'mongoose';
import { UserModel } from '../domains/identity/models/user.model';
import { SessionModel } from '../domains/auth/models/session.model';
import { redis } from '../core/config/redis';

describe('Auth Integration', () => {
  const testUser = {
    email: 'test@civichub.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  };

  beforeAll(async () => {
    // Clear DB and Redis before tests
    await UserModel.deleteMany({});
    await SessionModel.deleteMany({});
    await redis.flushall();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await redis.quit();
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should fail login if not verified (or allow but restricted)', async () => {
    // Note: The current auth.service.ts allows login if PENDING_VERIFICATION, but restricts permissions later
    // Let's verify login works but user status is PENDING_VERIFICATION
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });
    expect(res.status).toBe(200);
    expect(res.body.data.user.status).toBe('PENDING_VERIFICATION');
  });

  it('should lockout account after 5 failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword'
      });
    }

    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password // even correct password should fail now
    });

    expect(res.status).toBe(401); // Authentication Error (Account Locked)
    expect(res.body.message).toContain('Account locked');
  });
});
