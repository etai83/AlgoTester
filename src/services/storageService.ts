import fs from 'fs/promises';
import path from 'path';
import { StrategyRules } from '../types/rules';
import { BacktestResult } from '../types/backtest';

const STORAGE_FILE = 'strategies.json';
const HISTORY_DIR = 'history';

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

export interface HistorySummary {
  id: string;
  timestamp: number;
  stats: BacktestResult['stats'];
  rules: StrategyRules;
  initialBalance: number;
  fileName: string;
}

// Ensure history directory exists
async function ensureHistoryDir(): Promise<void> {
  try {
    await fs.mkdir(HISTORY_DIR, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') throw error;
  }
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
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error parsing ${STORAGE_FILE}:`, error);
      await fs.writeFile(`${STORAGE_FILE}.corrupted.${Date.now()}`, content);
      return [];
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function saveSimulation(result: BacktestResult, rules: StrategyRules, initialBalance: number, fileName: string): Promise<HistoryItem> {
  await ensureHistoryDir();

  const id = crypto.randomUUID();
  const timestamp = Date.now();

  const newHistoryItem: HistoryItem = {
    ...result,
    id,
    timestamp,
    rules,
    initialBalance,
    fileName
  };

  // Write individual file - filename includes timestamp for easy sorting
  const historyFilePath = path.join(HISTORY_DIR, `${timestamp}-${id}.json`);
  await fs.writeFile(historyFilePath, JSON.stringify(newHistoryItem));

  return newHistoryItem;
}

export async function loadHistorySummaries(): Promise<HistorySummary[]> {
  await ensureHistoryDir();

  try {
    const files = await fs.readdir(HISTORY_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json')).sort().reverse(); // Newest first (sorted by timestamp in filename)

    const summaries: HistorySummary[] = [];

    // Limit to last 100 for performance
    const limitedFiles = jsonFiles.slice(0, 100);

    for (const file of limitedFiles) {
      try {
        const filePath = path.join(HISTORY_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const item: HistoryItem = JSON.parse(content);

        summaries.push({
          id: item.id,
          timestamp: item.timestamp,
          stats: item.stats,
          rules: item.rules,
          initialBalance: item.initialBalance,
          fileName: item.fileName
        });
      } catch (err) {
        console.error(`Error reading history file ${file}:`, err);
      }
    }

    return summaries;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function loadHistoryItem(id: string): Promise<HistoryItem | null> {
  await ensureHistoryDir();

  try {
    const files = await fs.readdir(HISTORY_DIR);
    const matchingFile = files.find(f => f.includes(id) && f.endsWith('.json'));

    if (!matchingFile) {
      return null;
    }

    const filePath = path.join(HISTORY_DIR, matchingFile);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export async function loadLatestHistory(): Promise<HistoryItem | null> {
  await ensureHistoryDir();

  try {
    const files = await fs.readdir(HISTORY_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json')).sort().reverse();

    if (jsonFiles.length === 0) {
      return null;
    }

    const latestFile = jsonFiles[0]!;
    const filePath = path.join(HISTORY_DIR, latestFile);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

// Legacy function for backwards compatibility - now deprecated
export async function loadHistory(): Promise<HistoryItem[]> {
  console.warn('loadHistory() is deprecated. Use loadHistorySummaries(), loadLatestHistory(), or loadHistoryItem(id) instead.');

  await ensureHistoryDir();

  try {
    const files = await fs.readdir(HISTORY_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json')).sort().reverse();

    const items: HistoryItem[] = [];

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(HISTORY_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        items.push(JSON.parse(content));
      } catch (err) {
        console.error(`Error reading history file ${file}:`, err);
      }
    }

    return items;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}
