# GRIP — Integración frontend/backend (Evaluación 3)

## Repositorios

- Frontend: https://github.com/benjaminbrown19/sneaker-store
- Backend: https://github.com/benjaminbrown19/grip-backend

## 1. Iniciar backend y MySQL

El backend utiliza Java 25, Spring Boot 3.5.8 y MySQL 8. La configuración local predeterminada escucha en \`127.0.0.1:8080\` y conecta con la base \`grip_sneaker_store\`.

1. Iniciar MySQL.
2. Abrir \`sql/01_usuario_mysql.sql\` con una cuenta administradora, reemplazar \`CAMBIAR_POR_CLAVE_PRIVADA\` por una clave propia y ejecutar el script. Este crea la base de datos y el usuario \`grip_app\`.
3. Desde PowerShell, en la carpeta del backend, definir las variables privadas:

\`\`\`powershell
$env:GRIP_DB_PASSWORD = Read-Host 'Clave MySQL grip_app'
$env:GRIP_JWT_SECRET = Read-Host 'Secreto JWT aleatorio de al menos 32 caracteres'
$env:GRIP_ADMIN_PASSWORD = Read-Host 'Clave inicial administrador (mínimo 8 caracteres)'
$env:GRIP_VENDEDOR_PASSWORD = Read-Host 'Clave inicial vendedor (mínimo 8 caracteres)'
\`\`\`

4. Iniciar Spring Boot:

\`\`\`powershell
.\mvnw.cmd spring-boot:run
\`\`\`

Hibernate, mediante \`spring.jpa.hibernate.ddl-auto=update\`, crea o actualiza las tablas al iniciar; no crea por sí solo la base de datos ni el usuario MySQL. Después del primer arranque, ejecutar \`sql/02_productos_iniciales.sql\` si se necesita cargar el catálogo de demostración.

Swagger: http://127.0.0.1:8080/swagger-ui/index.html

No subir las variables, contraseñas, tokens ni archivos \`.env\` a GitHub.

## 2. Iniciar frontend

Con backend y MySQL activos, desde la carpeta del frontend:

\`\`\`bash
npm ci
npm run dev
\`\`\`

La aplicación queda normalmente en http://localhost:5173. El frontend utiliza por defecto \`http://127.0.0.1:8080/api/v1\`. Para cambiarlo, definir \`VITE_API_URL\` en \`.env.local\`.

## 3. Endpoints y permisos vigentes

| Método y endpoint | Acceso | Función |
| --- | --- | --- |
| \`POST /api/v1/auth/login\` | Público | Autenticación y emisión de JWT. |
| \`POST /api/v1/auth/registro\` | Público | Registro de cuenta con rol cliente. |
| \`POST /api/v1/auth/refresh\` | Refresh token válido | Renovación de tokens. |
| \`GET /api/v1/productos\` | Público | Consulta de catálogo. |
| \`GET /api/v1/productos/{codigo}\` | Público | Consulta de producto. |
| \`POST /api/v1/productos\` | Administrador | Crear producto. |
| \`PUT /api/v1/productos/{codigo}\` | Administrador | Actualizar producto. |
| \`DELETE /api/v1/productos/{codigo}\` | Administrador | Eliminar producto. |
| \`POST /api/v1/ordenes/checkout\` | Público | Registrar compra online; el servidor fuerza canal \`online\`. |
| \`POST /api/v1/ordenes\` | Administrador o vendedor | Registrar venta interna. |
| \`GET /api/v1/ordenes\` | Administrador o vendedor | Listar órdenes. |
| \`GET /api/v1/ordenes/{id}\` | Administrador o vendedor | Consultar orden y boleta. |

**Permiso del vendedor:** puede acceder a \`/admin/venta\`, registrar una venta mediante \`POST /api/v1/ordenes\`, consultar productos, órdenes, boletas y su perfil. No puede modificar productos ni utilizar los módulos exclusivos del administrador.

Una venta interna válida del vendedor debe poder responder HTTP 201 Created. No corresponde documentar HTTP 403 como resultado esperado para ese caso.

## 4. Reglas de negocio principales

- El backend utiliza precios y descuentos almacenados en MySQL; el frontend envía códigos de producto y cantidades.
- Se rechazan productos inexistentes, cantidades no válidas, productos duplicados en una misma orden y stock insuficiente.
- El descuento de stock se ejecuta dentro de una transacción y utiliza bloqueo de fila.
- Los cupones admitidos son \`GRIP10\` y \`GRIP20\`.
- El retiro en tienda no tiene costo de envío. El despacho cuesta $3.990 bajo $50.000 y es gratuito desde ese subtotal.
- Los pagos y estados asociados son simulaciones académicas; no existe cobro bancario real.

## 5. Pruebas

Frontend:

\`\`\`bash
npm test
npm run build
\`\`\`

Backend, desde PowerShell:

\`\`\`powershell
.\mvnw.cmd clean test
\`\`\`

La última ejecución comunicada para el frontend fue de 177/177 pruebas aprobadas y 0 fallidas, con 83,14 % de sentencias, 68,49 % de ramas, 82,75 % de funciones y 86,42 % de líneas. El backend contiene dos pruebas unitarias de \`ProductoService\`, con 0 fallos, 0 errores y 0 omitidas, según la ejecución comunicada.

Estas cifras son resultados reportados de ejecuciones anteriores; esta actualización documental no vuelve a ejecutar las pruebas. Las pruebas frontend simulan \`fetch\`, por lo que no equivalen a una prueba end-to-end con MySQL. No existe un reporte JaCoCo validado para informar cobertura Java.

## 6. Alcance y limitaciones

- Categorías, usuarios del panel y perfil siguen usando servicios locales; no son CRUD REST persistidos.
- Algunas vistas utilizan una caché local sincronizada desde la API.
- La identidad del vendedor se envía como metadato en la solicitud de venta y no se deriva directamente del JWT en el backend actual.
- El refresh token no cuenta con una lista de revocación en el servidor.
- El repositorio actual no contiene \`Dockerfile\` ni \`docker-compose.yml\`; esta integración corresponde a MySQL local.
