"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csvParser_1 = require("../utils/csvParser");
const promises_1 = __importDefault(require("fs/promises"));
jest.mock('fs/promises');
describe('CSV Parser', () => {
    it('should correctly parse a valid OHLCV CSV file', async () => {
        const mockCsvContent = `timestamp,open,high,low,close,volume
1672531200000,16547.9,16600,16500,16580,100
1672534800000,16580,16650,16550,16620,150
1672538400000,16620,16700,16600,16680,200
1672542000000,16680,16750,16650,16720,250
1672545600000,16720,16800,16700,16750,300`;
        promises_1.default.readFile.mockResolvedValue(mockCsvContent);
        const data = await (0, csvParser_1.parseCsv)('test.csv');
        expect(data).toHaveLength(5);
        expect(data[0]).toEqual({
            timestamp: 1672531200000,
            open: 16547.9,
            high: 16600,
            low: 16500,
            close: 16580,
            volume: 100
        });
    });
    it('should correctly parse a yfinance format CSV file', async () => {
        const mockCsvContent = `Datetime,Close,High,Low,Open,Volume
2024-01-09 14:30:00+00:00,403.31,403.77,401.71,401.91,13737477
2024-01-09 15:30:00+00:00,404.57,404.74,402.93,403.31,4982033`;
        promises_1.default.readFile.mockResolvedValue(mockCsvContent);
        const data = await (0, csvParser_1.parseCsv)('yfinance.csv');
        expect(data).toHaveLength(2);
        if (data.length > 0) {
            // Check first row
            const row = data[0];
            expect(row.timestamp).toBe(new Date('2024-01-09 14:30:00+00:00').getTime());
            expect(row.close).toBe(403.31);
            expect(row.open).toBe(401.91); // Open is column 4
            expect(row.high).toBe(403.77);
            expect(row.low).toBe(401.71);
            expect(row.volume).toBe(13737477);
        }
    });
    it('should throw an error for a non-existent file', async () => {
        promises_1.default.readFile.mockRejectedValue(new Error('File not found'));
        await expect((0, csvParser_1.parseCsv)('non_existent.csv')).rejects.toThrow();
    });
});
//# sourceMappingURL=csvParser.test.js.map