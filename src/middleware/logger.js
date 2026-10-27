/**
 * Middleware de registro de peticiones.
 *
 * Muestra método HTTP, URL solicitada, código de estado y tiempo de
 * procesamiento. Escucha el evento 'finish' de la respuesta para conocer
 * el código de estado final sin leer ni modificar el cuerpo XML.
 */
function requestLogger(req, res, next) {
  const inicio = process.hrtime.bigint();

  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - inicio) / 1e6;
    const fecha = new Date().toISOString();
    const soapAction = req.headers.soapaction ? ` SOAPAction=${req.headers.soapaction}` : '';
    console.log(
      `[${fecha}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms.toFixed(2)} ms)${soapAction}`
    );
  });

  next();
}

module.exports = requestLogger;
