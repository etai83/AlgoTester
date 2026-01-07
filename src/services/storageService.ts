import fs from 'fs/promises';
import path from 'path';
import { StrategyRules } from '../types/rules';

const STORAGE_FILE = 'strategies.json';

export interface Strategy {
  id: string;
  name: string;
  rules: StrategyRules;
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
