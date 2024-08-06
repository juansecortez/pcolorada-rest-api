"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const periodCtrl_1 = __importDefault(require("../controllers/periodCtrl"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.get("/getPeriod", auth_1.default, periodCtrl_1.default.getPeriod);
router.post("/authPeriod", auth_1.default, periodCtrl_1.default.authPeriod);
router.get("/getAniosPeriodByUser", periodCtrl_1.default.getAniosPeriodByUser);
router.get("/averageMatrix", auth_1.default, periodCtrl_1.default.averageMatrix);
router.post("/sendEmails", auth_1.default, periodCtrl_1.default.sendEmailPeriod);
router.post("/getWorkersByPeriod", auth_1.default, periodCtrl_1.default.getWorkersByPeriod);
exports.default = router;
