export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  [key: string]: number; // Allow for dynamic indicator fields
}
