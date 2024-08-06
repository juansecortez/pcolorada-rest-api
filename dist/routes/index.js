"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grataRouter_1 = __importDefault(require("./grataRouter"));
const authRouter_1 = __importDefault(require("./authRouter"));
const workersGrataRouter_1 = __importDefault(require("./workersGrataRouter"));
const periodRouter_1 = __importDefault(require("./periodRouter"));
const routes = {
    grataRouter: grataRouter_1.default,
    authRouter: authRouter_1.default,
    workersGrataRouter: workersGrataRouter_1.default,
    periodRouter: periodRouter_1.default,
};
exports.default = routes;
