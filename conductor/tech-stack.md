# Technology Stack

## Backend
- **Language:** Node.js (TypeScript)
- **Framework:** Express.js
- **Rationale:** TypeScript provides the type safety required for complex financial logic, while Express offers a lightweight and flexible foundation for the API. Node.js's non-blocking I/O is well-suited for handling concurrent data requests.

## Frontend
- **Framework:** React (TypeScript)
- **Styling:** Tailwind CSS
- **Rationale:** React's component-based architecture is ideal for building the data-dense, interactive dashboard required for rule definition and result visualization. Tailwind CSS allows for rapid, consistent styling of the professional/dark-themed UI.

## Backtesting Engine
- **Processing:** Server-Side (Node.js)
- **Rationale:** Performing backtest calculations on the server ensures consistent performance and allows for the processing of larger datasets without taxing the user's browser resources.

## Data Storage
- **Method:** Local JSON Files
- **Rationale:** For this POC, flat JSON files provide a simple and human-readable way to persist strategy definitions and cache historical data results without the overhead of a full database system.

## Data Sourcing
- **Integration:** Custom adapters for TradingView (via web scraping or public API if available) and local CSV file parsers.
