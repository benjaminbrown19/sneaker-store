# GRIP Sneaker Store — Frontend

Tienda online académica de zapatillas para DSY1104 Desarrollo Fullstack II. Frontend en React, integrado parcialmente mediante API REST con el backend Spring Boot y probado con Jasmine, Karma y React Testing Library.

## Tecnologías

- React 19, React Router 7 y Vite 7.
- Bootstrap 5.3.8 y React-Bootstrap 2.10.10.
- Jasmine 5, Karma 6, React Testing Library e Istanbul.
- Backend en la nube (Examen Final): [grip-microservicios](https://github.com/benjaminbrown19/grip-microservicios) — 3 microservicios Spring Boot + API Gateway en AWS EC2.
- Backend monolítico (Evaluación 3, plan B): [grip-backend](https://github.com/benjaminbrown19/grip-backend).
- Base de datos del backend: MySQL 8.

## Requisitos y puesta en marcha (MySQL local, sin Docker)

1. Tener MySQL Server 8 instalado y en ejecución.
2. Preparar el usuario MySQL de la aplicación una sola vez siguiendo `README_INICIO_LOCAL.md` del repositorio backend.
3. Iniciar el backend. Al arrancar, crea `grip_sneaker_store` si no existe, crea o actualiza las tablas y carga el catálogo inicial si la tabla de productos está vacía.
4. Desde la carpeta del frontend:

```powershell
npm ci
npm run dev
```

La aplicación queda en http://localhost:5173. El backend utiliza http://127.0.0.1:8080/api/v1.

Si el backend utiliza otra dirección, definir `VITE_API_URL` en un archivo local `.env.local`. No incluir contraseñas, tokens ni secretos en archivos versionados.

## Ejecución con el backend en la nube (AWS EC2 + microservicios)

Para el Examen Final el backend se ejecuta en AWS (instancia EC2 `grip-servidor`, AWS Academy Learner Lab) con Docker Compose: `ms-usuarios`, `ms-productos` y `ms-ordenes` detrás de un API Gateway Nginx que publica solo el puerto 8080. Detalle en el repositorio [grip-microservicios](https://github.com/benjaminbrown19/grip-microservicios).

El frontend se ejecuta en el computador local, igual que en el ejemplo de despliegue del curso:

1. Copiar `.env.development.local.example` como `.env.development.local` y reemplazar `IP_PUBLICA_EC2` por la IP pública actual de la instancia (cambia si el laboratorio reinicia la EC2).
2. Ejecutar:

```powershell
npm ci
npm run dev
```

3. Abrir http://localhost:5173 (el puerto **5173** es el permitido por CORS en los microservicios).

Requisitos del lado de AWS: la instancia encendida (iniciar el Learner Lab) y la IP pública de quien usa el frontend autorizada en el puerto 8080 del grupo de seguridad. El archivo `.env.development.local` está excluido de Git (`*.local`).

Swagger unificado de los tres microservicios: `http://IP_PUBLICA_EC2:8080/swagger-ui/index.html`.

## Integración con el backend

| Módulo | Persistencia / servicio | Alcance |
| --- | --- | --- |
| Login, registro y renovación JWT | API REST `/api/v1/auth` | Integrado. El registro público crea cuentas con rol cliente. |
| Catálogo de productos | API REST `/api/v1/productos` | La vista de productos consulta el backend y sincroniza los datos con el repositorio local. |
| Detalle de producto | Repositorio local sincronizado | La vista utiliza `productosService`; no consulta directamente el endpoint de detalle al abrirse. |
| Crear, editar y eliminar productos | API REST `/api/v1/productos` | Solo administrador. |
| Checkout online | API REST `POST /api/v1/ordenes/checkout` | Público; el backend fuerza el canal `online`, valida precios y stock y persiste la orden. |
| Venta presencial | API REST `POST /api/v1/ordenes` | Administrador y vendedor autenticados. |
| Consulta de órdenes y boletas | API REST `/api/v1/ordenes` | Administrador y vendedor. |
| Reportes generales | API REST de órdenes | Calculados a partir de órdenes persistidas. |
| Categorías | Servicios locales y almacenamiento del navegador | No existe CRUD REST persistido. |
| Usuarios del panel y perfil | Servicios locales y almacenamiento del navegador | No corresponden al registro/autenticación persistidos en MySQL. |
| Reportes de productos | Servicios locales | No todos los reportes se calculan desde la API. |

## Roles y permisos

La interfaz controla las rutas mediante `RutaPorRol.jsx` y el menú mediante `MenuLateralAdmin.jsx`. El backend vuelve a validar los permisos en `SecurityConfig.java`.

- **Visitante / cliente:** puede navegar la tienda y realizar checkout público. No accede a las operaciones internas de órdenes.
- **Vendedor:** puede consultar productos, consultar órdenes y boletas, revisar su perfil y registrar ventas presenciales desde `/admin/venta`. No puede crear, editar ni eliminar productos ni administrar módulos exclusivos del administrador.
- **Administrador:** accede al panel completo, administra productos y utiliza los módulos administrativos disponibles.

Importante: el vendedor sí puede registrar ventas. Una solicitud válida desde su sesión a `POST /api/v1/ordenes` no debe rechazarse con HTTP 403; la autorización actual permite los roles administrador y vendedor.

## Sesión y seguridad

- El frontend conserva los tokens JWT y los datos visibles de sesión en `sessionStorage`.
- El access token tiene vigencia de 15 minutos y el refresh token de 7 días.
- Ante un HTTP 401, `src/services/api.js` intenta renovar el token y repetir una vez la solicitud.
- Si la renovación falla, se eliminan los tokens y se cierra la sesión visible.
- El backend es la autoridad final para los permisos; ocultar un enlace o bloquear una ruta frontend no reemplaza la autorización del servidor.

## Pruebas y compilación

```powershell
npm.cmd test
npm.cmd run build
```

Las pruebas se ejecutan con Karma y Chrome Headless. El reporte de cobertura se genera en `coverage/index.html`. Las pruebas frontend simulan las solicitudes `fetch` desde `src/tests/index.js`; por tanto, verifican componentes, servicios y flujos de interfaz, pero no son pruebas end-to-end contra Spring Boot y MySQL.

## Limitaciones conocidas

- Categorías, usuarios del panel y perfil no están migrados a persistencia REST.
- El detalle de producto y algunos reportes utilizan servicios locales o una caché sincronizada.
- Los pagos, comprobantes y códigos de autorización son simulaciones académicas; no existe conexión con una pasarela bancaria real.
- Los tokens se guardan en `sessionStorage`; no se utilizan cookies HttpOnly ni una lista de revocación de refresh tokens en el servidor.
- Los datos del vendedor se envían como metadatos en el cuerpo de la venta; el backend actual no los deriva directamente del sujeto del JWT.
