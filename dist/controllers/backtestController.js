"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewData = exports.executeBacktest = void 0;
const csvParser_1 = require("../utils/csvParser");
const simulator_1 = require("../utils/simulator");
const storageService_1 = require("../services/storageService");
const executeBacktest = async (req, res) => {
    try {
        let { csvFilePath, rules, initialBalance } = req.body;
        // Parse rules if it came as a JSON string (typical with FormData)
        if (typeof rules === 'string') {
            try {
                rules = JSON.parse(rules);
            }
            catch (e) {
                return res.status(400).json({ error: 'Invalid rules format' });
            }
        }
        if (req.file) {
            csvFilePath = req.file.path;
        }
        if (!csvFilePath) {
            return res.status(400).json({ error: 'csvFilePath or file upload is required' });
        }
        if (!rules || !rules.entry || !rules.exit) {
            return res.status(400).json({ error: 'Valid entry and exit rules are required' });
        }
        const candles = await (0, csvParser_1.parseCsv)(csvFilePath);
        if (candles.length === 0) {
            return res.status(400).json({ error: 'No data found in CSV file' });
        }
        // Pass default commission if not provided
        const initBalance = Number(initialBalance) || 10000;
        const result = (0, simulator_1.runBacktest)(candles, rules, initBalance, 0.001);
        // Save to history
        await (0, storageService_1.saveSimulation)(result, rules, initBalance);
        res.json(result);
    }
    catch (error) {
        console.error('Backtest error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};
exports.executeBacktest = executeBacktest;
const previewData = async (req, res) => {
    try {
        let csvFilePath;
        if (req.file) {
            csvFilePath = req.file.path;
        }
        if (!csvFilePath) {
            return res.status(400).json({ error: 'File upload is required' });
        }
        const candles = await (0, csvParser_1.parseCsv)(csvFilePath);
        if (candles.length === 0) {
            return res.status(400).json({ error: 'No data found in CSV file' });
        }
        // Return only necessary data for plotting
        const preview = candles.map(c => ({
            timestamp: c.timestamp,
            close: c.close
        }));
        res.json(preview);
    }
    catch (error) {
        console.error('Preview error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};
exports.previewData = previewData;
//# sourceMappingURL=backtestController.js.map