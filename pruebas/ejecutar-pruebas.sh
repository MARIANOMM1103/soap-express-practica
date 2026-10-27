#!/usr/bin/env bash
# Ejecuta las cuatro peticiones SOAP y guarda las respuestas en evidencias/respuestas.
# Requisitos: servidor en ejecución (npm start) y curl instalado.
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/soap}"
DIR="$(cd "$(dirname "$0")" && pwd)"
SALIDA="$DIR/../evidencias/respuestas"
mkdir -p "$SALIDA"

# archivo | endpoint | SOAPAction
PRUEBAS=(
  "01-CelsiusAFahrenheit.xml|conversiones|http://practica.uvm.mx/conversiones/CelsiusAFahrenheit"
  "02-KilometrosAMillas.xml|conversiones|http://practica.uvm.mx/conversiones/KilometrosAMillas"
  "03-AreaRectangulo.xml|geometria|http://practica.uvm.mx/geometria/AreaRectangulo"
  "04-PerimetroRectangulo.xml|geometria|http://practica.uvm.mx/geometria/PerimetroRectangulo"
)

for prueba in "${PRUEBAS[@]}"; do
  IFS='|' read -r archivo endpoint accion <<< "$prueba"
  destino="$SALIDA/${archivo%.xml}-respuesta.xml"
  echo "==> $archivo  ->  $BASE_URL/$endpoint"
  curl -s -X POST "$BASE_URL/$endpoint" \
       -H "Content-Type: text/xml; charset=utf-8" \
       -H "SOAPAction: \"$accion\"" \
       --data-binary "@$DIR/$archivo" \
       -o "$destino"
  cat "$destino"; echo; echo
done
