import { Router } from "express";
import grataCtrl from "../controllers/grataCtrl";
const router = Router();

//Crear grata
router.post("/creategrata", grataCtrl.createGrata);

export default router;
