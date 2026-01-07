"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const strategyController_1 = require("../controllers/strategyController");
const router = (0, express_1.Router)();
router.get('/', strategyController_1.getStrategies);
router.post('/', strategyController_1.createStrategy);
exports.default = router;
//# sourceMappingURL=strategyRoutes.js.map