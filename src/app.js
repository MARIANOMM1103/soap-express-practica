/**
 * Configuración de la aplicación Express.
 * Aplica el middleware general y monta el Router de servicios SOAP.
 * No contiene lógica de operaciones ni definiciones de contratos.
 */
const express = require('express');

const { SOAP_BASE_PATH } = require('./config');
const requestLogger = require('./middleware/logger');
const soapRouter = require('./routes/soap.routes');

const app = express();

// 1. Registro de peticiones: se ejecuta antes de las rutas SOAP
app.use(requestLogger);

// 2. Servicios SOAP
app.use(SOAP_BASE_PATH, soapRouter);

// 3. Cualquier otra ruta no existe
app.use((req, res) => {
  res.status(404).type('text/plain').send('Recurso no encontrado');
});

module.exports = app;
