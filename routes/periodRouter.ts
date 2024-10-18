import { Router } from "express";
import periodCtrl from "../controllers/periodCtrl";
import auth from "../middlewares/auth";

const router = Router();

router.get("/getPeriod", auth, periodCtrl.getPeriod);
router.post("/authPeriod", auth, periodCtrl.authPeriod);
router.get("/getAniosPeriodByUser", periodCtrl.getAniosPeriodByUser);
router.get("/averageMatrix", auth, periodCtrl.averageMatrix);
router.post("/sendEmails", auth, periodCtrl.sendEmailPeriod);
router.post("/getWorkersByPeriod", auth, periodCtrl.getWorkersByPeriod);

// Nuevas rutas agregadas
router.get("/getPeriodsByBono", auth, periodCtrl.getPeriodsByBono);
router.get("/getPeriodsBySucesion", auth, periodCtrl.getPeriodsBySucesion);
router.post("/getPeopleBySucesion", auth, periodCtrl.getPeopleBySucesion);
export default router;
