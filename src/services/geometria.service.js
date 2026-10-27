/**
 * Implementación de GeometriaService.
 *
 * Los nombres GeometriaService / GeometriaPort / AreaRectangulo /
 * PerimetroRectangulo coinciden con src/wsdl/geometria.wsdl.
 */
function leerDimensiones(args) {
  const base = Number(args.base);
  const altura = Number(args.altura);
  if (Number.isNaN(base) || Number.isNaN(altura)) {
    throw crearFault('Los parámetros base y altura deben ser numéricos');
  }
  if (base < 0 || altura < 0) {
    throw crearFault('La base y la altura no pueden ser negativas');
  }
  return { base, altura };
}

function areaRectangulo(args) {
  const { base, altura } = leerDimensiones(args);
  return { area: base * altura };
}

function perimetroRectangulo(args) {
  const { base, altura } = leerDimensiones(args);
  return { perimetro: 2 * (base + altura) };
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
  GeometriaService: {
    GeometriaPort: {
      AreaRectangulo: areaRectangulo,
      PerimetroRectangulo: perimetroRectangulo,
    },
  },
};
