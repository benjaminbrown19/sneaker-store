# GRIP — Integración frontend/backend (Evaluación 3)

## Repositorios

- Frontend: https://github.com/benjaminbrown19/sneaker-store/tree/evaluacion-3
- Backend: https://github.com/benjaminbrown19/grip-backend/tree/evaluacion-3

## 1. Preparación inicial de MySQL (una sola vez por computador)

El sistema utiliza MySQL Server 8 instalado localmente. No requiere Docker.

1. Iniciar el servicio MySQL Server.
2. Abrir MySQL Workbench y conectarse con una cuenta administradora.
3. Abrir `grip-backend/sql/01_usuario_mysql.sql`.
4. Reemplazar `CAMBIAR_POR_CLAVE_PRIVADA` por una contraseña propia y ejecutar el script una sola vez. El script crea el usuario `grip_app` y los permisos necesarios; no crea manualmente la base.
5. El backend usa `createDatabaseIfNotExist=true`: al iniciar, crea automáticamente `grip_sneaker_store` si todavía no existe. Hibernate crea o actualiza las tablas.
6. La clase `ProductosIniciales` carga los ocho productos de demostración si la tabla `productos` está vacía. No es necesario importar `sql/02_productos_iniciales.sql`.

El permiso global `CREATE` del usuario `grip_app` se contempla para desarrollo y presentación local. No exponer este usuario a Internet. Si el usuario ya existe, el script no cambia su contraseña.

## 2. Iniciar backend

Desde PowerShell, en la carpeta del backend:

```powershell
$env:GRIP_DB_HOST = "localhost"
$env:GRIP_DB_PORT = "3306"
$env:GRIP_DB_NAME = "grip_sneaker_store"
$env:GRIP_DB_USER = "grip_app"
$env:GRIP_DB_PASSWORD = Read-Host 'Clave MySQL grip_app'
$env:GRIP_JWT_SECRET = Read-Host 'Secreto JWT aleatorio de al menos 32 caracteres'
$env:GRIP_ADMIN_PASSWORD = Read-Host 'Clave inicial administrador (mínimo 8 caracteres)'
$env:GRIP_VENDEDOR_PASSWORD = Read-Host 'Clave inicial vendedor (mínimo 8 caracteres)'
.\mvnw.cmd spring-boot:run
```

Esperar a que Spring Boot indique que inició correctamente.

Swagger: http://127.0.0.1:8080/swagger-ui/index.html

## 3. Iniciar frontend

En otra ventana de PowerShell, en la carpeta del frontend:

```powershell
npm ci
npm run dev
```

Tienda: http://localhost:5173

## 4. Reinicios y conservación de datos

En las siguientes ejecuciones no se debe volver a importar ningún SQL. Basta con iniciar MySQL, backend y frontend. La base de datos, las cuentas, las ventas y el inventario se conservan mientras no se elimine la base.

Cada computador mantiene su propia base de datos local. Para compartir ventas e inventario entre equipos se necesitaría un servidor MySQL compartido y configurar la dirección de ese servidor en `GRIP_DB_HOST`.

## 5. Endpoints y permisos vigentes

| Método y endpoint | Acceso | Función |
| --- | --- | --- |
| `POST /api/v1/auth/login` | Público | Autenticación y emisión de JWT. |
| `POST /api/v1/auth/registro` | Público | Registro de cuenta con rol cliente. |
| `POST /api/v1/auth/refresh` | Refresh token válido | Renovación de tokens. |
| `GET /api/v1/productos` | Público | Consulta de catálogo. |
| `GET /api/v1/productos/{codigo}` | Público | Consulta de producto. |
| `POST /api/v1/productos` | Administrador | Crear producto. |
| `PUT /api/v1/productos/{codigo}` | Administrador | Actualizar producto. |
| `DELETE /api/v1/productos/{codigo}` | Administrador | Eliminar producto. |
| `POST /api/v1/ordenes/checkout` | Público | Registrar compra online; el servidor fuerza canal `online`. |
| `POST /api/v1/ordenes` | Administrador o vendedor | Registrar venta interna. |
| `GET /api/v1/ordenes` | Administrador o vendedor | Listar órdenes. |
| `GET /api/v1/ordenes/{id}` | Administrador o vendedor | Consultar orden y boleta. |

**Permiso del vendedor:** puede acceder a `/admin/venta`, registrar una venta mediante `POST /api/v1/ordenes`, consultar productos, órdenes, boletas y su perfil. No puede modificar productos ni utilizar los módulos exclusivos del administrador. Una venta interna válida del vendedor debe poder responder HTTP 201 Created; no corresponde documentar HTTP 403 como resultado esperado para ese caso.

## 6. Reglas de negocio principales

- El backend utiliza precios y descuentos almacenados en MySQL; el frontend envía códigos de producto y cantidades.
- Se rechazan productos inexistentes, cantidades no válidas, productos duplicados en una misma orden y stock insuficiente.
- El descuento de stock se ejecuta dentro de una transacción y utiliza bloqueo de fila.
- Los cupones admitidos son `GRIP10` y `GRIP20`.
- El retiro en tienda no tiene costo de envío. El despacho cuesta $3.990 bajo $50.000 y es gratuito desde ese subtotal.
- Los pagos y estados asociados son simulaciones académicas; no existe cobro bancario real.

## 7. Pruebas

Frontend:

```powershell
npm.cmd test
npm.cmd run build
```

Backend, desde PowerShell:

```powershell
.\mvnw.cmd clean test
```

Las cifras de cobertura y resultados de ejecuciones anteriores deben mantenerse como evidencia histórica y no interpretarse como una nueva ejecución de esta integración. Las pruebas frontend simulan `fetch`, por lo que no equivalen a una prueba end-to-end con MySQL. No existe un reporte JaCoCo validado para informar cobertura Java.

## 8. Alcance y limitaciones

- Categorías, usuarios del panel y perfil siguen usando servicios locales; no son CRUD REST persistidos.
- Algunas vistas utilizan una caché local sincronizada desde la API.
- La identidad del vendedor se envía como metadato en la solicitud de venta y no se deriva directamente del JWT en el backend actual.
- El refresh token no cuenta con una lista de revocación en el servidor.
- La ejecución documentada utiliza MySQL local, sin Docker.
