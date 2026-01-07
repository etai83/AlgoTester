import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import backtestRoutes from './routes/backtestRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/backtest', backtestRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
