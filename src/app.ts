import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import backtestRoutes from './routes/backtestRoutes';
import strategyRoutes from './routes/strategyRoutes';
import historyRoutes from './routes/historyRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/backtest', backtestRoutes);
app.use('/api/strategies', strategyRoutes);
app.use('/api/history', historyRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
