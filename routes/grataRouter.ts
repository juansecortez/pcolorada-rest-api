import { Router } from "express";
import grataCtrl from "../controllers/grataCtrl";
import auth from "../middlewares/auth";
const router = Router();

router.post("/creategrata", auth, grataCtrl.createGrata);
router.post("/validExistGrata", grataCtrl.validateExistGrata);
router.post("/finish",auth, grataCtrl.finishGrata);
router.post("/direcciones", grataCtrl.getDirecciones);
router.get("/aniosGrata", grataCtrl.getAnios);
router.get("/getPeriods",auth, grataCtrl.getPeriods);
router.get("/anios", grataCtrl.getYears);
router.get("/getStatusGrata", grataCtrl.getStatusGrata);
router.get("/getGrata",auth, grataCtrl.getGrata);
router.get("/currentPeriod", grataCtrl.getCurrentPeriod);

export default router;
