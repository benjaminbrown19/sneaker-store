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

El prefijo de la API es `/api/v1`. El detalle de rutas y permisos se mantiene en el README del backend.

## 6. Pruebas

Desde el backend:

```powershell
.\mvnw.cmd clean test
```

Desde el frontend:

```powershell
npm.cmd test
npm.cmd run build
```

## 7. Alcance y limitaciones

- La base de datos, tablas y catálogo inicial se preparan automáticamente al iniciar el backend después de la configuración inicial del usuario MySQL.
- El cargador de productos solo inserta los datos de demostración si la tabla está vacía; no sobrescribe stock ni precios existentes.
- Categorías, usuarios del panel y perfil mantienen el alcance local indicado en el README del frontend.
- La ejecución documentada utiliza MySQL local, sin Docker.
