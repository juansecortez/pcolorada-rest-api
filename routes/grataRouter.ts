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
router.get("/aniosGrata", grataCtrl.getAnios);
router.post("/authGrata", grataCtrl.authorizeGrata);
router.get("/authGrata", grataCtrl.getAuthGrata);

export default router;
