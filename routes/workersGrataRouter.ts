import { Router } from "express";
import workersGrataCtrl from "../controllers/workersGrataCtrl";
const router = Router();

router.post("/", workersGrataCtrl.insertBonoFinalWorker);
router.get("/directions/user", workersGrataCtrl.getDirectionsByUserId);
router.post("/bonoFinal/average", workersGrataCtrl.updateWorkersBonoFinalAverage);
router.post("/bonoFinal/max", workersGrataCtrl.updateWorkersBonoFinalMax);
router.post("/bonoFinal/min", workersGrataCtrl.updateWorkersBonoFinalMin);

export default router;
