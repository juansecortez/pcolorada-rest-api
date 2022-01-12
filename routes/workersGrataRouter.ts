import { Router } from "express";
import workersGrataCtrl from "../controllers/workersGrataCtrl";
const router = Router();

router.post("/", workersGrataCtrl.insertBonoFinalWorker);
router.get("/directions/user", workersGrataCtrl.getDirectionsByUserId);

export default router;
