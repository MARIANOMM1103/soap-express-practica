/**
 * Punto de arranque: levanta el servidor HTTP.
 */
const app = require('./app');
const { PORT, SOAP_BASE_PATH } = require('./config');

app.listen(PORT, () => {
  const base = `http://localhost:${PORT}${SOAP_BASE_PATH}`;
  console.log(`Servidor SOAP escuchando en http://localhost:${PORT}`);
  console.log(`  ConversionesService -> ${base}/conversiones?wsdl`);
  console.log(`  GeometriaService    -> ${base}/geometria?wsdl`);
});
