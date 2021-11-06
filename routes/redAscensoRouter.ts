import { Router } from "express";
import redAscensoCtrl from "../controllers/redAscensoCtrl";
const router = Router();

//Crear kardex excel
router.get("/createkardex", redAscensoCtrl.createKardex);

export default router;
