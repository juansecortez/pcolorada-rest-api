import { Router } from "express";
import grataCtrl from "../controllers/grataCtrl";
import auth from "../middlewares/auth";
const router = Router();

router.post("/creategrata", auth, grataCtrl.createGrata);
router.post("/createsucesion", auth, grataCtrl.createSucesion);
router.post("/validExistGrata", grataCtrl.validateExistGrata);
router.post("/finish",auth, grataCtrl.finishGrata);
router.post("/direcciones", grataCtrl.getDirecciones);
router.get("/aniosGrata", grataCtrl.getAnios);
router.get("/aniosGrataSucesion", grataCtrl.getAniosSucesion);
router.get("/getPeriods",auth, grataCtrl.getPeriods);
router.get("/anios", grataCtrl.getYears);
router.get("/getStatusGrata", grataCtrl.getStatusGrata);
router.get("/getGrata",auth, grataCtrl.getGrata);
router.get("/getSucesion",auth, grataCtrl.getSucesion);
router.get("/currentPeriod", grataCtrl.getCurrentPeriod);
router.post("/createsucesiones", auth, grataCtrl.createSucesiones);
router.post("/buscarColaborador",  grataCtrl.buscarColaboradorPorNombre);
router.put("/updatePotencial",  grataCtrl.updatePotencial);
router.post("/finalizeWorkers",  grataCtrl.finalizeWorkers);
router.post('/buscarcolaboradorporcodigo',  grataCtrl.buscarColaboradorPorCodigoEmpleado);
router.post('/eliminarregistroporid',  grataCtrl.eliminarRegistroPorId);
router.post('/modificarregistroporid',  grataCtrl.modificarRegistroPorId);
router.post('/indicadores',  grataCtrl.buscarEstadoSucesionPorCodigoEmplead);

export default router;
