export const validateInsertBonoFinal = (
  codigo_Empleado: number,
  bono_Final: number,
  anio: number
) => {
  const errors = [];
  if (!codigo_Empleado) {
    errors.push("El codigo del empleado es requerido");
  } else if (isNaN(codigo_Empleado)) {
    errors.push("El codigo del empleado tiene que ser numerico");
  }
  if (!anio) {
    errors.push("El año es requerido");
  } else if (isNaN(anio)) {
    errors.push("El año tiene que ser numerico");
  }
  if (isNaN(bono_Final)) {
    errors.push("El bono final tiene que ser numerico");
  }
  return errors;
};
export const validateGrata = (
  presupuestoFinanzas: number,
  presupuestoMinas: number,
  presupuestoPelet: number,
  presupuestoRH: number,
  presupuestoGeneral: number,
  presupuestoBeneficio: number,
  presupuestoTec: number,
  presupuestoDirectores: number,
  anio: number,
  fechaFin: string,
  fechaInicio: string
) => {
  const errors = [];
  if (!anio) {
    errors.push("El periodo es requerido");
  } else if (isNaN(anio)) {
    errors.push("El año tiene que ser numerico");
  }
  if (!presupuestoFinanzas) {
    errors.push("El presupuesto de la dirección de finanzas es requerido");
  } else if (isNaN(presupuestoFinanzas)) {
    errors.push(
      "El presupuesto de la dirección de finanzas tiene que ser numerico"
    );
  }
  if (!presupuestoMinas) {
    errors.push("El presupuesto de la dirección de minas es requerido");
  } else if (isNaN(presupuestoMinas)) {
    errors.push(
      "El presupuesto de la dirección de minas tiene que ser numerico"
    );
  }
  if (!presupuestoPelet) {
    errors.push("El presupuesto de la dirección de peletizado es requerido");
  } else if (isNaN(presupuestoPelet)) {
    errors.push(
      "El presupuesto de la dirección de peletizado tiene que ser numerico"
    );
  }
  if (!presupuestoRH) {
    errors.push("El presupuesto de la dirección de RH es requerido");
  } else if (isNaN(presupuestoRH)) {
    errors.push("El presupuesto de la dirección de RH tiene que ser numerico");
  }
  if (!presupuestoGeneral) {
    errors.push("El presupuesto de la dirección general es requerido");
  } else if (isNaN(presupuestoGeneral)) {
    errors.push(
      "El presupuesto de la dirección general tiene que ser numerico"
    );
  }
  if (!presupuestoBeneficio) {
    errors.push("El presupuesto de la dirección de beneficio es requerido");
  } else if (isNaN(presupuestoBeneficio)) {
    errors.push(
      "El presupuesto de la dirección de beneficio tiene que ser numerico"
    );
  }
  if (!presupuestoTec) {
    errors.push("El presupuesto de la dirección tecnologíca es requerido");
  } else if (isNaN(presupuestoTec)) {
    errors.push(
      "El presupuesto de la dirección tecnologíca tiene que ser numerico"
    );
  }
  if (!presupuestoDirectores) {
    errors.push("El presupuesto de la dirección de directores es requerido");
  } else if (isNaN(presupuestoDirectores)) {
    errors.push(
      "El presupuesto de la dirección de directores tiene que ser numerico"
    );
  }
  if (!fechaFin) {
    errors.push("La fecha fin es requerida");
  } else if (typeof fechaFin !== "string") {
    errors.push("La fecha fin tiene que ser string");
  }
  if (!fechaFin) {
    errors.push("La fecha inicio es requerida");
  } else if (typeof fechaInicio !== "string") {
    errors.push("La fecha inicio tiene que ser string");
  }

  return errors;
};
