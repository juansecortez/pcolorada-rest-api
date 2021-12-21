import { Router } from "express";
import grataCtrl from "../controllers/grataCtrl";
import auth from "../middlewares/auth";
const router = Router();

//Crear grata
router.post("/creategrata", grataCtrl.createGrata);
router.post("/validExistGrata", grataCtrl.validateExistGrata);
router.get("/presupuesto", grataCtrl.getPresupuestoGrata);
router.post("/finish", grataCtrl.finishGrata);
router.post("/direcciones", grataCtrl.getDirecciones);

export default router;
