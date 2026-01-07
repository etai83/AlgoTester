"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsv = parseCsv;
const promises_1 = __importDefault(require("fs/promises"));
async function parseCsv(filePath) {
    try {
        const content = await promises_1.default.readFile(filePath, 'utf-8');
        const lines = content.trim().split('\n');
        const dataLines = lines.slice(1);
        const parsedData = [];
        for (const line of dataLines) {
            const parts = line.split(',').map(Number);
            const [timestamp, open, high, low, close, volume] = parts;
            if (typeof timestamp === 'number' && !isNaN(timestamp) &&
                typeof open === 'number' && !isNaN(open) &&
                typeof high === 'number' && !isNaN(high) &&
                typeof low === 'number' && !isNaN(low) &&
                typeof close === 'number' && !isNaN(close) &&
                typeof volume === 'number' && !isNaN(volume)) {
                parsedData.push({
                    timestamp,
                    open,
                    high,
                    low,
                    close,
                    volume
                });
            }
        }
        return parsedData;
    }
    catch (error) {
        throw new Error(`Failed to parse CSV: ${error.message}`);
    }
}
//# sourceMappingURL=csvParser.js.map