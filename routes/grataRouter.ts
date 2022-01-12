import { Router } from "express";
import grataCtrl from "../controllers/grataCtrl";
import auth from "../middlewares/auth";
const router = Router();

router.post("/creategrata", auth, grataCtrl.createGrata);
router.post("/validExistGrata", grataCtrl.validateExistGrata);
router.post("/finish", grataCtrl.finishGrata);
router.post("/direcciones", grataCtrl.getDirecciones);
router.get("/aniosGrata", grataCtrl.getAnios);
router.post("/authGrata", grataCtrl.authorizeGrata);
router.get("/authGrata", grataCtrl.getAuthGrata);
router.get("/anios", grataCtrl.getYears);
router.get("/getGratas", grataCtrl.getGratas);
router.get("/getStatusGrata", grataCtrl.getStatusGrata);
router.get("/getGrata", auth, grataCtrl.getGrata);

export default router;
