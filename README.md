# AlgoTester

AlgoTester is a web application designed to help developers and traders backtest automated trading strategies against historical market data (focusing on BTCUSD). It bridges the gap between complex algorithmic development and accessible validation by offering an intuitive interface for rule definition and comprehensive performance analysis.

## Purpose

The primary goal of AlgoTester is to provide a reliable environment for testing and refining trading algorithms before deployment. It allows users to define entry and exit rules based on standard technical indicators and visualize how those strategies would have performed in the past.

## Key Features

*   **Rule Definition GUI:** An intuitive web interface allowing users to define trading rules through a selection of standard technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands, etc.) and logical operators.
*   **Robust Backtesting Engine:** A server-side engine that executes defined rules against historical data to simulate trading performance accurately.
*   **Comprehensive Analytics:** detailed reporting on key performance metrics, including:
    *   Net Profit/Loss
    *   Win Rate
    *   Maximum Drawdown
    *   Sharpe Ratio
*   **Visualizations:**
    *   **Equity Curve:** Visual representation of account balance over time.
    *   **Interactive Price Chart:** Candlestick chart with buy/sell markers.
    *   **Returns Histogram:** Distribution of trade returns.
*   **Flexible Data Sourcing:** Supports backtesting against local CSV files containing historical OHLCV data.

## Tech Stack

*   **Backend:** Node.js, Express.js, TypeScript
*   **Frontend:** React, Tailwind CSS, TypeScript
*   **Data Storage:** Local JSON files / CSV processing

## Project Structure

The project is organized as a monorepo containing both the backend and frontend code.

```text
/
├── conductor/           # Project documentation and guidelines
├── data/                # Sample data files (e.g., sample_btcusd.csv)
├── dist/                # Compiled backend code
├── frontend/            # React frontend application
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # React components (Charts, Forms, etc.)
│       ├── services/    # API integration services
│       └── ...
├── src/                 # Backend source code
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions (Indicators, CSV parser, Simulator)
├── uploads/             # Directory for uploaded CSV files
├── package.json         # Root package configuration and scripts
└── ...
```

## Getting Started

### Prerequisites

*   Node.js (v14+ recommended)
*   npm

### Installation

1.  Clone the repository.
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Install frontend dependencies:
    ```bash
    cd frontend
    npm install
    ```

### Running the Application

**Backend:**

To start the backend server in development mode (with hot-reload):
```bash
npm run dev
```
The server typically runs on `http://localhost:3000` (check `src/server.ts` or console output).

**Frontend:**

To start the React frontend:
```bash
npm run frontend:dev
```
The frontend typically runs on `http://localhost:5173` (Vite default).

### Running Tests

**Backend Tests:**
```bash
npm test
```

**Frontend Tests:**
```bash
npm run frontend:test
```
