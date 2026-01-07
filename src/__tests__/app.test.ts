import request from 'supertest';
import app from '../app';
import path from 'path';

// Mock dependencies to avoid actual file system or heavy computation if needed, 
// but for integration test, using real ones is better for verifying wiring.
// However, we need a real file for upload testing.

describe('Server Initialization', () => {
  it('should return 200 OK for the health check endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('should run backtest with file upload', async () => {
    const rules = {
        entry: { type: 'comparison', left: 'Close', operator: '>', right: 100 },
        exit: { type: 'comparison', left: 'Close', operator: '>', right: 200 }
    };

    const csvContent = `timestamp,open,high,low,close,volume
1672531200000,16547.9,16600,16500,16580,100
1672534800000,16580,16650,16550,16620,150`;

    const response = await request(app)
      .post('/api/backtest/run')
      .field('rules', JSON.stringify(rules))
      .field('initialBalance', 10000)
      .attach('file', Buffer.from(csvContent), 'data.csv');

    expect(response.status).toBe(200);
    expect(response.body.stats).toBeDefined();
    expect(response.body.equityCurve).toBeDefined();
  });

  it('should return 400 for invalid backtest request', async () => {
    const response = await request(app)
      .post('/api/backtest/run')
      .send({}); // Missing file/path

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
