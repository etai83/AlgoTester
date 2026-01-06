# Spec: MVP Backtester Core

## Overview
This track focuses on delivering a functional Proof of Concept (POC) for backtesting trading algorithms on BTCUSD data. It includes a backend engine capable of processing technical indicators and logic, and a frontend for users to define rules and view results.

## Requirements

### Backend (Node.js/TypeScript)
- **Data Ingestion:**
    - Parse CSV files containing OHLCV (Open, High, Low, Close, Volume) data for BTCUSD (intraday granularity).
    - Provide a placeholder/interface for TradingView integration.
- **Indicator Calculations:**
    - Implement Simple Moving Average (SMA).
    - Implement Exponential Moving Average (EMA).
    - Implement Relative Strength Index (RSI).
- **Rule Engine:**
    - Support simple comparisons (e.g., `Close > SMA_50`).
    - Support multi-indicator logic with `AND`/`OR` operators.
- **Execution Simulation:**
    - Simulate trades based on entry/exit rules.
    - Support fixed position sizing.
    - Support configurable starting balance and commission/fees.
- **Reporting Engine:**
    - Calculate Net Profit/Loss, Win Rate, and Max Drawdown.
    - Generate an equity curve and trade log.

### Frontend (React/TypeScript/Tailwind)
- **Rule Definition UI:**
    - A GUI to build rules using indicators and logical operators.
- **Dashboard:**
    - Display summary metrics (Profit, Win Rate, Max Drawdown).
    - Visualization: Equity Curve chart.
    - Visualization: Interactive Price Chart with trade markers.
    - Visualization: Distribution of returns histogram.

## Success Criteria
- A user can upload a BTCUSD CSV file or select a predefined dataset.
- A user can build a rule like `(RSI < 30 AND Close > EMA_50)` for entry.
- The system correctly simulates trades and displays accurate performance metrics.
- The UI renders charts showing the backtest results.
