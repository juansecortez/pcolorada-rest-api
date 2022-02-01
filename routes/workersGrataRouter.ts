import { Router } from "express";
import workersGrataCtrl from "../controllers/workersGrataCtrl";
import auth from "../middlewares/auth";
const router = Router();

router.post("/", workersGrataCtrl.insertBonoFinalWorker);
router.post("/history", workersGrataCtrl.getWorkerHistory);
router.post("/direction", workersGrataCtrl.getWorkersByDirection);
router.get("/directions/user", workersGrataCtrl.getDirectionsByUserId);
router.post("/bonoFinal/average",auth, workersGrataCtrl.updateWorkersBonoFinalAverage);
router.post("/bonoFinal/max",auth, workersGrataCtrl.updateWorkersBonoFinalMax);
router.post("/bonoFinal/min",auth, workersGrataCtrl.updateWorkersBonoFinalMin);

export default router;
