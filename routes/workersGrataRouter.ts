import { Router } from "express";
import workersGrataCtrl from "../controllers/workersGrataCtrl";
const router = Router();

router.get("/", workersGrataCtrl.getWorkers);
router.get("/:direction", workersGrataCtrl.getWorkersByDirection);
router.post("/", workersGrataCtrl.insertBonoFinalWorker);
router.post("/year", workersGrataCtrl.getWorkersByYear);
router.post("/calf", workersGrataCtrl.getWorkersTotByCalf);
router.post("/potential", workersGrataCtrl.getWorkersTotByPotential);

export default router;
