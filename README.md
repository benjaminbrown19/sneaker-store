# GRIP Sneaker Store (Frontend React)

Tienda online de zapatillas para DSY1104 Desarrollo Fullstack II. Frontend en React con diseño responsivo en Bootstrap, integrado por REST con el backend Spring Boot (JWT) y probado con Jasmine y Karma.

## Tecnologías

- React 19, React Router 7 y Vite 7
- Bootstrap 5 y React-Bootstrap
- Jasmine, Karma y React Testing Library (cobertura con Istanbul)
- Backend: Spring Boot + MySQL + JWT (repositorio `grip-backend`)

## Cómo ejecutar

1. Levantar el backend en `http://127.0.0.1:8080` (ver README del backend).
2. En esta carpeta:

```bash
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`. Si el backend usa otra dirección, copiar `.env.example` a `.env.local` y ajustar `VITE_API_URL`.

## Pruebas

```bash
npm test
```

Ejecuta las pruebas en Chrome Headless (sin necesidad de backend: `fetch` se simula en `src/tests/index.js`) y genera el reporte en `coverage/index.html`. Si Chrome no está en la ruta por defecto, definir `CHROME_BIN`.

## Autenticación y sesión

- Login y registro usan `/api/v1/auth`. El backend devuelve un JWT de acceso (15 min) y uno de refresco (7 días).
- `src/services/api.js` agrega el token a cada solicitud, renueva el token ante un 401 y repite la solicitud una vez. Si la renovación falla, cierra la sesión.
- La sesión se guarda en `sessionStorage`, por lo que sobrevive a recargas de la pestaña.
- `RutaPorRol` y `MenuLateralAdmin` restringen las vistas según el rol (administrador, vendedor, cliente). El backend vuelve a validar el rol en cada endpoint.
- Las cuentas iniciales de administrador y vendedor las crea el backend con las variables de entorno indicadas en su README. Los clientes se registran desde `/registro`.

## Qué está integrado con el backend y qué sigue local

| Módulo | Origen de datos |
| --- | --- |
| Login, registro y renovación de token | API REST |
| Productos (catálogo, detalle, crear, editar, eliminar) | API REST |
| Órdenes y boletas (checkout, venta en tienda solo administrador, listado, detalle, reportes) | API REST |
| Categorías | `localStorage` (pendiente de API) |
| Usuarios del panel admin y perfil | `localStorage` (pendiente de API) |

Reglas del checkout (las calcula el servidor): despacho gratis desde $50.000 o con retiro en tienda, en otro caso $3.990; cupones `GRIP10` y `GRIP20`; una tarjeta terminada en `0000` se rechaza en el frontend para simular un pago fallido.

## Estructura

```
src/
  components/   atoms, molecules, organisms, templates
  pages/        tienda, admin
  context/      sesión (JWT) y carrito
  hooks/        useFormulario, useAvisoCarrito
  services/     api.js (cliente HTTP con JWT), *Api.js (REST), *Service.js (localStorage)
  data/         datos iniciales
  utils/        formato, validaciones, cálculo del carrito
  tests/        pruebas Jasmine
```

## Ajuste final de permisos

El vendedor consulta productos y órdenes; no puede acceder a `/admin/venta`. El registro de venta interno `POST /api/v1/ordenes` requiere administrador. Se conserva `/admin/perfil` para edición de datos propios, sujeto a confirmación con Anexo 1. Las categorías y usuarios administrativos continúan en `localStorage`, no deben describirse como persistencia MySQL.
