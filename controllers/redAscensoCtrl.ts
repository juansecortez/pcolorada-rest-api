import { Request, Response } from "express";
import excel from "exceljs";
// import { tutorials } from "../domyData";

const redAscensoCtrl = {
  createKardex: async (req: Request, res: Response) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Kardex");
    const a1 = worksheet.getCell("A1");
    const b1 = worksheet.getCell("B1");
    const c1 = worksheet.getCell("C1");
    const d1 = worksheet.getCell("D1");
    const e1 = worksheet.getCell("E1");
    const f1 = worksheet.getCell("F1");
    const g1 = worksheet.getCell("G1");
    const h1 = worksheet.getCell("H1");
    const i1 = worksheet.getCell("I1");
    const j1 = worksheet.getCell("J1");
    const k1 = worksheet.getCell("K1");
    const l1 = worksheet.getCell("L1");
    const m1 = worksheet.getCell("M1");
    const style = {
      font: {
        color: { argb: "FFFFFFFF" },
      },
    };
    const fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    a1.style = style;
    a1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    b1.style = style;
    b1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    c1.style = style;
    c1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    d1.style = style;
    d1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    e1.style = style;
    e1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    f1.style = style;
    f1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    g1.style = style;
    g1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    h1.style = style;
    h1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    i1.style = style;
    i1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    j1.style = style;
    j1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    k1.style = style;
    k1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    l1.style = style;
    l1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    m1.style = style;
    m1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    worksheet.columns = [
      { header: "Codigo", key: "codigo", width: 8 },
      { header: "Nivel", key: "nivel", width: 10 },
      {
        header: "Nombre editado del empleado o candidato",
        key: "name",
        width: 38,
      },
      { header: "Fecha de baja", key: "fecha_baja", width: 15 },
      { header: "Fecha de alta", key: "fecha_alta", width: 15 },
      { header: "Relación laboral", key: "relacion_lab", width: 15 },
      { header: "Posición", key: "posicion", width: 25 },
      { header: "Centro de coste", key: "centro_coste", width: 15 },
      { header: "Unidad organizativa", key: "unidad_org", width: 30 },
      { header: "Status ocupación", key: "status_oc", width: 18 },
      { header: "Area de personal", key: "area_personal", width: 20 },
      { header: "Subdivisión de personal", key: "sub_personal", width: 25 },
      { header: "Edad del empleado", key: "edad", width: 20 },
    ];
    // Add Array Rows
    worksheet.addRows([]);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "kardex.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  },
};
export default redAscensoCtrl;
