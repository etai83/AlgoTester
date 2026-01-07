"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveStrategy = saveStrategy;
exports.loadStrategies = loadStrategies;
const promises_1 = __importDefault(require("fs/promises"));
const STORAGE_FILE = 'strategies.json';
async function saveStrategy(strategy) {
    const strategies = await loadStrategies();
    const newStrategy = { ...strategy, id: crypto.randomUUID() };
    strategies.push(newStrategy);
    await promises_1.default.writeFile(STORAGE_FILE, JSON.stringify(strategies, null, 2));
    return newStrategy;
}
async function loadStrategies() {
    try {
        const content = await promises_1.default.readFile(STORAGE_FILE, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
//# sourceMappingURL=storageService.js.map