import XLSX from "xlsx";
import fs from "fs";
import { IDataExcel } from "../interfaces";

export const readExcel = (uploadPath: string): IDataExcel[] => {
  const woorkBook = XLSX.readFile(uploadPath);
  const woorkSheets = woorkBook.SheetNames;
  const sheet = woorkSheets[0];
  const dataExcel: IDataExcel[] = XLSX.utils.sheet_to_json(
    woorkBook.Sheets[sheet]
  );
  fs.unlinkSync(uploadPath);
  return dataExcel;
};
