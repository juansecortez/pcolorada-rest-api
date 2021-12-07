import { Router } from "express";
import workersGrataCtrl from "../controllers/workersGrataCtrl";
const router = Router();

router.post("/year", workersGrataCtrl.getWorkersByYear);

export default router;
