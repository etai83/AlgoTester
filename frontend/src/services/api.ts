import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const runBacktest = async (payload: any) => {
  const response = await axios.post(`${API_BASE_URL}/api/backtest/run`, payload);
  return response.data;
};