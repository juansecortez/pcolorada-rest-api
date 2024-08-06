"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readExcel = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const readExcel = (uploadPath) => {
    const woorkBook = xlsx_1.default.readFile(uploadPath);
    const woorkSheets = woorkBook.SheetNames;
    const sheet = woorkSheets[0];
    const dataExcel = xlsx_1.default.utils.sheet_to_json(woorkBook.Sheets[sheet]);
    fs_1.default.unlinkSync(uploadPath);
    return dataExcel;
};
exports.readExcel = readExcel;
