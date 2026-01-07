"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storageService_1 = require("../storageService");
const promises_1 = __importDefault(require("fs/promises"));
jest.mock('fs/promises');
describe('Storage Service', () => {
    const mockStrategies = [
        { id: '1', name: 'Test Strat', rules: {} }
    ];
    it('should save a strategy to JSON file', async () => {
        promises_1.default.readFile.mockRejectedValue({ code: 'ENOENT' }); // File doesn't exist
        promises_1.default.writeFile.mockResolvedValue(undefined);
        await (0, storageService_1.saveStrategy)({ name: 'Test Strat', rules: {} });
        expect(promises_1.default.writeFile).toHaveBeenCalled();
    });
    it('should load strategies from JSON file', async () => {
        promises_1.default.readFile.mockResolvedValue(JSON.stringify(mockStrategies));
        const strategies = await (0, storageService_1.loadStrategies)();
        expect(strategies).toEqual(mockStrategies);
    });
});
//# sourceMappingURL=storageService.test.js.map