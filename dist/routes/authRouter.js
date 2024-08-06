"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authCtrl_1 = __importDefault(require("../controllers/authCtrl"));
const router = (0, express_1.Router)();
router.post("/login", authCtrl_1.default.loginSOAP);
router.get("/refresh_token", authCtrl_1.default.refreshToken);
router.get("/logout", authCtrl_1.default.logout);
exports.default = router;
