# Servicios web SOAP con Express y WSDL

Aplicación Node.js + Express que expone dos servicios web **SOAP 1.1**, cada uno con su propio contrato **WSDL** y dos operaciones:

| Servicio | Endpoint | Operaciones |
|---|---|---|
| `ConversionesService` | `/soap/conversiones` | `CelsiusAFahrenheit`, `KilometrosAMillas` |
| `GeometriaService` | `/soap/geometria` | `AreaRectangulo`, `PerimetroRectangulo` |

Las peticiones y respuestas viajan como sobres XML (no JSON). Los servicios se registran desde un `express.Router` y un middleware registra cada petición.

## Requisitos

- Node.js 18 o superior (probado con Node 22) y npm
- `curl` (para el script de pruebas) o Postman / SoapUI
- Git

## Instalación

```bash
git clone <URL-del-repositorio>
cd soap-express-practica
npm install
```

## Ejecución

```bash
npm start
```

Salida esperada:

```
Servidor SOAP escuchando en http://localhost:3000
  ConversionesService -> http://localhost:3000/soap/conversiones?wsdl
  GeometriaService    -> http://localhost:3000/soap/geometria?wsdl
```

> El puerto se puede cambiar con la variable `PORT` (ver `.env.example`). Si lo cambias, actualiza también `soap:address` en los dos archivos de `src/wsdl/`, ya que la dirección publicada en cada contrato apunta a `http://localhost:3000`.

## Estructura del proyecto

```
soap-express-practica/
├── src/
│   ├── server.js                     # Arranque: levanta el servidor HTTP
│   ├── app.js                        # Configuración: middleware + montaje del Router
│   ├── config/index.js               # Puerto, prefijo /soap y carpeta de WSDL
│   ├── middleware/logger.js          # Registro: método, URL, estado y tiempo
│   ├── routes/soap.routes.js         # Router: registra los dos servicios SOAP
│   ├── services/
│   │   ├── conversiones.service.js   # Lógica de ConversionesService
│   │   └── geometria.service.js      # Lógica de GeometriaService
│   └── wsdl/
│       ├── conversiones.wsdl         # Contrato de ConversionesService
│       └── geometria.wsdl            # Contrato de GeometriaService
├── pruebas/                          # Peticiones SOAP y script de pruebas
├── evidencias/                       # Capturas, respuestas y registro del middleware
├── CONCLUSIONES.md
├── README.md
└── .gitignore
```

## Endpoints y contratos WSDL

| Servicio | Endpoint (POST) | WSDL (GET) |
|---|---|---|
| ConversionesService | `http://localhost:3000/soap/conversiones` | `http://localhost:3000/soap/conversiones?wsdl` |
| GeometriaService | `http://localhost:3000/soap/geometria` | `http://localhost:3000/soap/geometria?wsdl` |

Cada WSDL (estilo *document/literal*) contiene `types`, `message`, `portType`, `binding` y `service`. Los nombres de servicio, puerto y operaciones coinciden con la implementación en `src/services/`.

## Pruebas

### Opción A: script automático

Con el servidor en ejecución, en otra terminal:

```bash
npm run test:soap
```

El script envía las cuatro peticiones de `pruebas/` y guarda las respuestas en `evidencias/respuestas/`.

### Opción B: curl manual

| Operación | Archivo | Endpoint | SOAPAction | Resultado esperado |
|---|---|---|---|---|
| CelsiusAFahrenheit | `pruebas/01-CelsiusAFahrenheit.xml` | `/soap/conversiones` | `http://practica.uvm.mx/conversiones/CelsiusAFahrenheit` | `<fahrenheit>77</fahrenheit>` |
| KilometrosAMillas | `pruebas/02-KilometrosAMillas.xml` | `/soap/conversiones` | `http://practica.uvm.mx/conversiones/KilometrosAMillas` | `<millas>6.21371</millas>` |
| AreaRectangulo | `pruebas/03-AreaRectangulo.xml` | `/soap/geometria` | `http://practica.uvm.mx/geometria/AreaRectangulo` | `<area>40</area>` |
| PerimetroRectangulo | `pruebas/04-PerimetroRectangulo.xml` | `/soap/geometria` | `http://practica.uvm.mx/geometria/PerimetroRectangulo` | `<perimetro>26</perimetro>` |

Ejemplo:

```bash
curl -X POST http://localhost:3000/soap/conversiones \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H 'SOAPAction: "http://practica.uvm.mx/conversiones/CelsiusAFahrenheit"' \
  --data-binary @pruebas/01-CelsiusAFahrenheit.xml
```

Respuesta:

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://practica.uvm.mx/conversiones">
  <soap:Body>
    <tns:CelsiusAFahrenheitResponse>
      <fahrenheit>77</fahrenheit>
    </tns:CelsiusAFahrenheitResponse>
  </soap:Body>
</soap:Envelope>
```

> En Windows sin Git Bash, usa `curl.exe` y comillas dobles escapadas en el encabezado SOAPAction, o bien Postman.

### Opción C: Postman o SoapUI

- **Postman:** método `POST`, URL del endpoint, encabezados `Content-Type: text/xml; charset=utf-8` y `SOAPAction` según la tabla; en *Body → raw* pega el contenido del archivo XML.
- **SoapUI:** *New SOAP Project* → pega la URL `...?wsdl`; SoapUI genera las cuatro peticiones a partir del contrato.

### Validación de errores

Si se envía un valor no numérico o negativo, el servicio responde con un `soap:Fault` (HTTP 500), también en XML.

## Evidencias

| Archivo | Contenido |
|---|---|
| `evidencias/capturas/wsdl-conversiones.png` | Contrato WSDL de ConversionesService en el navegador |
| `evidencias/capturas/wsdl-geometria.png` | Contrato WSDL de GeometriaService en el navegador |
| `evidencias/capturas/respuestas-soap.png` | Salida de las cuatro pruebas |
| `evidencias/capturas/registro-middleware.png` | Registro del middleware durante las pruebas |
| `evidencias/respuestas/*.xml` | Respuestas SOAP de cada operación |
| `evidencias/registro-middleware.txt` | Registro del middleware en texto |

## Middleware de registro

`src/middleware/logger.js` se aplica en `app.js` antes del Router. Escucha el evento `finish` de la respuesta y muestra:

```
[2026-10-27T23:33:08.039Z] POST /soap/conversiones -> 200 (15.13 ms) SOAPAction="http://practica.uvm.mx/conversiones/CelsiusAFahrenheit"
[2026-10-27T23:33:09.125Z] GET /soap/conversiones?wsdl -> 200 (2.09 ms)
```

No lee ni modifica el cuerpo XML de la petición ni de la respuesta.

## Autor

Mariano Martínez Marrón · Universidad del Valle de México
