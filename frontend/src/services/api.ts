import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const runBacktest = async (payload: any) => {
  const formData = new FormData();
  
  if (payload.file) {
    formData.append('file', payload.file);
  } else if (payload.csvFilePath) {
    formData.append('csvFilePath', payload.csvFilePath);
  }

  formData.append('rules', JSON.stringify(payload.rules));
  formData.append('initialBalance', payload.initialBalance.toString());

  const response = await axios.post(`${API_BASE_URL}/api/backtest/run`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const previewCsv = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/api/backtest/preview`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
