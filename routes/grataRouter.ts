import { Router } from "express";
import grataCtrl from "../controllers/grataCtrl";
import auth from "../middlewares/auth";
const router = Router();

//Crear grata
router.post("/creategrata", grataCtrl.createGrata);

export default router;
