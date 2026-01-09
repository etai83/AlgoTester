"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = void 0;
const storageService_1 = require("../services/storageService");
const getHistory = async (req, res) => {
    try {
        const history = await (0, storageService_1.loadHistory)();
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getHistory = getHistory;
//# sourceMappingURL=historyController.js.map