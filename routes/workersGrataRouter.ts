import { Router } from "express";
import workersGrataCtrl from "../controllers/workersGrataCtrl";
const router = Router();

router.post("/", workersGrataCtrl.insertBonoFinalWorker);
router.post("/year", workersGrataCtrl.getWorkersByYear);
router.post("/calf", workersGrataCtrl.getWorkersTotByCalf);

export default router;
