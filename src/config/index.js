/**
 * Configuración general de la aplicación.
 * Centraliza valores que podrían cambiar entre entornos.
 */
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;

module.exports = {
  PORT,
  // Prefijo bajo el cual se monta el Router de servicios SOAP
  SOAP_BASE_PATH: '/soap',
  // Carpeta donde viven los contratos WSDL
  WSDL_DIR: path.join(__dirname, '..', 'wsdl'),
};
