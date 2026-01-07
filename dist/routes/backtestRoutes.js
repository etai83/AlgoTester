"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const backtestController_1 = require("../controllers/backtestController");
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const router = (0, express_1.Router)();
router.post('/run', upload.single('file'), backtestController_1.executeBacktest);
router.post('/preview', upload.single('file'), backtestController_1.previewData);
exports.default = router;
//# sourceMappingURL=backtestRoutes.js.map