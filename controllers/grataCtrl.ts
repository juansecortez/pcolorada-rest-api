import { Request, Response } from "express";
import newGrata from "../utils/createGrata";

const grataController = {
  createGrata: async (req: Request, res: Response) => {
    interface IGrata {
      anio: number;
      fecha_Inicio: string;
      fecha_Fin: string;
    }
    const { anio, fecha_Fin, fecha_Inicio }: IGrata = req.body;

    const response1 = await newGrata(1, anio, fecha_Fin, fecha_Inicio);
    const response2 = await newGrata(2, anio, fecha_Fin, fecha_Inicio);
    const response3 = await newGrata(3, anio, fecha_Fin, fecha_Inicio);
    const response4 = await newGrata(4, anio, fecha_Fin, fecha_Inicio);
    if (response1 && response2 && response3 && response4) {
      res.status(200).json({ message: "Gratas creadas correctamente" });
    } else {
      res.status(500).json({ message: "Error al crear la grata" });
    }
  },
};
export default grataController;
