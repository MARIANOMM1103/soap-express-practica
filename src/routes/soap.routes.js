/**
 * Router de servicios SOAP.
 *
 * Registra cada servicio (implementación + contrato WSDL) sobre un
 * express.Router. El archivo principal solo monta este Router en /soap,
 * de modo que los endpoints finales quedan en:
 *   /soap/conversiones  (WSDL en /soap/conversiones?wsdl)
 *   /soap/geometria     (WSDL en /soap/geometria?wsdl)
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const soap = require('soap');

const { WSDL_DIR } = require('../config');
const conversionesService = require('../services/conversiones.service');
const geometriaService = require('../services/geometria.service');

const router = express.Router();

// Tabla de servicios: agregar uno nuevo solo requiere otra entrada aquí
const servicios = [
  { ruta: '/conversiones', implementacion: conversionesService, wsdl: 'conversiones.wsdl' },
  { ruta: '/geometria', implementacion: geometriaService, wsdl: 'geometria.wsdl' },
];

for (const { ruta, implementacion, wsdl } of servicios) {
  const contrato = fs.readFileSync(path.join(WSDL_DIR, wsdl), 'utf8');
  // soap.listen detecta que recibe un Router de Express y registra la ruta en él
  soap.listen(router, ruta, implementacion, contrato);
}

module.exports = router;
