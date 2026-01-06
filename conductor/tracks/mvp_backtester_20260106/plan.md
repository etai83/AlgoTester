# Plan: MVP Backtester Core

## Phase 1: Foundation & Backend Core
*Goal: Project scaffolding and core backtesting logic.*

- [x] Task: Initialize backend Express server with TypeScript and basic project structure. c1f1c50
- [x] Task: Implement CSV data parser for BTCUSD OHLCV data. 9ca22c6
- [x] Task: Write Tests: Indicator calculation logic (SMA, EMA, RSI). 423f017
- [x] Task: Implement Indicator calculations. 423f017
- [ ] Task: Write Tests: Rule evaluation engine (comparisons and AND/OR logic).
- [ ] Task: Implement Rule evaluation engine.
- [ ] Task: Write Tests: Trade simulation logic (entry/exit, fees, balance).
- [ ] Task: Implement Trade simulation logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Backend Core' (Protocol in workflow.md)

## Phase 2: Frontend Development & Integration
*Goal: Build the UI and connect it to the backtesting engine.*

- [ ] Task: Initialize React frontend with Tailwind CSS and basic routing.
- [ ] Task: Implement Rule Definition GUI components.
- [ ] Task: Implement Dashboard summary metrics display.
- [ ] Task: Implement Equity Curve chart using a charting library (e.g., Chart.js or Recharts).
- [ ] Task: Implement Interactive Price Chart with trade markers.
- [ ] Task: Implement Distribution of Returns histogram.
- [ ] Task: Connect Frontend to Backend API for running backtests.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Frontend Development & Integration' (Protocol in workflow.md)

## Phase 3: Refinement & Validation
*Goal: Final testing and data persistence.*

- [ ] Task: Implement local JSON storage for strategy definitions.
- [ ] Task: Add error handling and technical logging for backtest failures.
- [ ] Task: Perform end-to-end testing with a sample BTCUSD dataset.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Refinement & Validation' (Protocol in workflow.md)
