"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const backtestRoutes_1 = __importDefault(require("./routes/backtestRoutes"));
const strategyRoutes_1 = __importDefault(require("./routes/strategyRoutes"));
const historyRoutes_1 = __importDefault(require("./routes/historyRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api/backtest', backtestRoutes_1.default);
app.use('/api/strategies', strategyRoutes_1.default);
app.use('/api/history', historyRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map