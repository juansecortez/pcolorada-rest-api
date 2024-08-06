"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workersGrataCtrl_1 = __importDefault(require("../controllers/workersGrataCtrl"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/", workersGrataCtrl_1.default.insertBonoFinalWorker);
router.post("/history", workersGrataCtrl_1.default.getWorkerHistory);
router.post("/direction", workersGrataCtrl_1.default.getWorkersByDirection);
router.get("/directions/user", workersGrataCtrl_1.default.getDirectionsByUserId);
router.post("/bonoFinal/average", auth_1.default, workersGrataCtrl_1.default.updateWorkersBonoFinalAverage);
router.post("/bonoFinal/max", auth_1.default, workersGrataCtrl_1.default.updateWorkersBonoFinalMax);
router.post("/bonoFinal/min", auth_1.default, workersGrataCtrl_1.default.updateWorkersBonoFinalMin);
exports.default = router;
