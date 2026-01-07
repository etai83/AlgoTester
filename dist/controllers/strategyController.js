"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStrategy = exports.getStrategies = void 0;
const storageService_1 = require("../services/storageService");
const getStrategies = async (req, res) => {
    try {
        const strategies = await (0, storageService_1.loadStrategies)();
        res.json(strategies);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getStrategies = getStrategies;
const createStrategy = async (req, res) => {
    try {
        const { name, rules } = req.body;
        if (!name || !rules) {
            return res.status(400).json({ error: 'Name and rules are required' });
        }
        const strategy = await (0, storageService_1.saveStrategy)({ name, rules });
        res.json(strategy);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createStrategy = createStrategy;
//# sourceMappingURL=strategyController.js.map