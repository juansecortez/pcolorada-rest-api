import { Router } from "express";
import authCtrl from "../controllers/authCtrl";
const router = Router();

router.post("/login", authCtrl.loging);

export default router;
