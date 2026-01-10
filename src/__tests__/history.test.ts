import request from 'supertest';
import app from '../app';

describe('History Endpoint', () => {
  it('should return 200 and an array of history items', async () => {
    const response = await request(app).get('/api/history');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Since we fixed the file, it should have at least one item
    expect(response.body.length).toBeGreaterThan(0);
  });
});
