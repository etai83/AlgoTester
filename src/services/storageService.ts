import fs from 'fs/promises';
import path from 'path';
import { StrategyRules } from '../types/rules';
import { BacktestResult } from '../types/backtest';

const STORAGE_FILE = 'strategies.json';
const HISTORY_FILE = 'history.json';

export interface Strategy {
  id: string;
  name: string;
  rules: StrategyRules;
}

export interface HistoryItem extends BacktestResult {
  id: string;
  timestamp: number;
  rules: StrategyRules;
  initialBalance: number;
  fileName: string;
}

export async function saveStrategy(strategy: Omit<Strategy, 'id'>): Promise<Strategy> {
  const strategies = await loadStrategies();
  const newStrategy = { ...strategy, id: crypto.randomUUID() };
  strategies.push(newStrategy);
  
  await fs.writeFile(STORAGE_FILE, JSON.stringify(strategies, null, 2));
  return newStrategy;
}

export async function loadStrategies(): Promise<Strategy[]> {
  try {
    const content = await fs.readFile(STORAGE_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function saveSimulation(result: BacktestResult, rules: StrategyRules, initialBalance: number, fileName: string): Promise<HistoryItem> {
    const history = await loadHistory();
    const newHistoryItem: HistoryItem = {
        ...result,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        rules,
        initialBalance,
        fileName
    };
    history.push(newHistoryItem);
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
    return newHistoryItem;
}

export async function loadHistory(): Promise<HistoryItem[]> {
    try {
        const content = await fs.readFile(HISTORY_FILE, 'utf-8');
        return JSON.parse(content);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
