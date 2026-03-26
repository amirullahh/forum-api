import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import pool from '../../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../../tests/ThreadsTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../../tests/AuthenticationsTableTestHelper.js';
import container from '../../../container.js';
import createServer from '../../createServer.js';

describe('Rate Limit Middleware', () => {
  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should apply rate limiting to /threads endpoint', async () => {
    const app = await createServer(container);

    // Make 91 requests (1 more than limit of 90)
    const requests = [];
    for (let i = 0; i < 91; i++) {
      requests.push(
        request(app)
          .get('/threads/thread-123')
          .send()
      );
    }

    const responses = await Promise.all(requests);

    // At least one request should be rate limited (status 429)
    const rateLimitedResponses = responses.filter((res) => res.status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);

    if (rateLimitedResponses.length > 0) {
      expect(rateLimitedResponses[0].body.status).toEqual('fail');
      expect(rateLimitedResponses[0].body.message).toContain('Too many requests');
    }
  });
});
