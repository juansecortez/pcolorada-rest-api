import { Router } from "express";
import periodCtrl from "../controllers/periodCtrl";
import auth from "../middlewares/auth";
const router = Router();

router.get("/getPeriod", periodCtrl.getPeriod);
router.post("/authPeriod", periodCtrl.authPeriod);

export default router;
