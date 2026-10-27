/**
 * Implementación de ConversionesService.
 *
 * La estructura { Servicio: { Puerto: { Operacion } } } debe coincidir
 * exactamente con los nombres declarados en src/wsdl/conversiones.wsdl
 * (<service name>, <port name> y <operation name>).
 */
const KM_A_MILLAS = 0.621371;

// Redondeo para evitar ruido de punto flotante (p. ej. 6.213710000000001)
const redondear = (valor, decimales = 6) => Number(valor.toFixed(decimales));

function celsiusAFahrenheit(args) {
  const celsius = Number(args.celsius);
  if (Number.isNaN(celsius)) {
    throw crearFault('El parámetro celsius debe ser numérico');
  }
  return { fahrenheit: redondear((celsius * 9) / 5 + 32) };
}

function kilometrosAMillas(args) {
  const kilometros = Number(args.kilometros);
  if (Number.isNaN(kilometros)) {
    throw crearFault('El parámetro kilometros debe ser numérico');
  }
  return { millas: redondear(kilometros * KM_A_MILLAS) };
}

function crearFault(mensaje) {
  return {
    Fault: {
      faultcode: 'soap:Client',
      faultstring: mensaje,
      statusCode: 500, // SOAP 1.1: los Fault se responden con HTTP 500
    },
  };
}

module.exports = {
  ConversionesService: {
    ConversionesPort: {
      CelsiusAFahrenheit: celsiusAFahrenheit,
      KilometrosAMillas: kilometrosAMillas,
    },
  },
};
