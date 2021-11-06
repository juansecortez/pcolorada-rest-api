import { Router } from "express";
import { check } from "express-validator";
import solicitudesCtrl from "../controllers/solicitudesCtrl";
const router = Router();

//Obtener solicitudes totales
router.post(
  "/total",
  [
    check("fechaInicio", "La fecha inicio es obligatoria").notEmpty(),
    check("fechaFin", "La fecha fin es obligatoria").notEmpty(),
  ],
  solicitudesCtrl.getSolicitudesTot
);
//Obtener solicitudes insumos
router.post(
  "/insumos",
  [
    check("fechaInicio", "La fecha inicio es obligatoria").notEmpty(),
    check("fechaFin", "La fecha fin es obligatoria").notEmpty(),
  ],
  solicitudesCtrl.getSolicitudesInsumos
);
//Obtener solicitudes servicios
router.post(
  "/servicios",
  [
    check("fechaInicio", "La fecha inicio es obligatoria").notEmpty(),
    check("fechaFin", "La fecha fin es obligatoria").notEmpty(),
  ],
  solicitudesCtrl.getSolicitudesServicios
);
//Obtener solicitudes general
router.post(
  "/general",
  [
    check("fechaInicio", "La fecha inicio es obligatoria").notEmpty(),
    check("fechaFin", "La fecha fin es obligatoria").notEmpty(),
  ],
  solicitudesCtrl.getSolicitudesGeneral
);
//Obtener solicitudes grupo de compras
router.post(
  "/grupocom",
  [
    check("fechaInicio", "La fecha inicio es obligatoria").notEmpty(),
    check("fechaFin", "La fecha fin es obligatoria").notEmpty(),
  ],
  solicitudesCtrl.getSolicitudesGrupoCom
);
//Obtener solicitudes almacen
router.post(
  "/almacen",
  [
    check("fechaInicio", "La fecha inicio es obligatoria").notEmpty(),
    check("fechaFin", "La fecha fin es obligatoria").notEmpty(),
  ],
  solicitudesCtrl.getSolicitudesAlmacen
);

export default router;
