# Initial Concept

I want to build an app called **AlgoTester** that will backtest trading algorithms in tradingview. I want to create a POC that will get a set of rules and will backtest their profit and other measurement for the BTCUSD

# Product Vision

**AlgoTester** aims to provide developers building automated trading bots with a streamlined web application for backtesting trading strategies against BTCUSD historical data. The application will bridge the gap between complex algorithmic development and accessible validation by offering an intuitive interface for rule definition and performance analysis.

# Target Audience

- **Primary:** Developers building automated trading bots who need a reliable environment to test and refine their algorithms before deployment.

# Key Features

- **Rule Definition GUI:** An intuitive web interface allowing users to define trading rules through a selection of standard technical indicators and logical operators.
- **Backtesting Engine:** A robust engine that executes defined rules against historical BTCUSD data to simulate trading performance.
- **Performance Analytics:** Comprehensive reporting on key metrics, including:
    - Net Profit/Loss
    - Win Rate
    - Maximum Drawdown
    - Equity Curve Visualization
    - Interactive Price Chart with Trade Markers
    - Returns Histogram
- **Flexible Data Sourcing:** 
    - **Primary:** Direct integration with TradingView for high-fidelity historical data.
    - **Fallback:** Support for local CSV file uploads containing historical OHLCV data.

# Completed Milestones

- **MVP Backtester Core:** A functional POC including a backend engine for data ingestion, indicator calculation, and trade simulation, paired with a React frontend for rule definition and result visualization.

# User Experience

Users will interact with a modern web application where they can configure their strategy rules, select the time range for backtesting, and view immediate results through a dashboard highlighting the strategy's profitability and risk profile.