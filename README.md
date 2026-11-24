# GRIP Sneaker Store (Frontend React)

Tienda online de zapatillas en React, integrada por REST con el backend Spring Boot (JWT) y probada con Jasmine y Karma.

## Tecnologías

- React 19, React Router 7 y Vite 7.
- Bootstrap 5 y React-Bootstrap.
- Jasmine, Karma y React Testing Library.
- Backend: Spring Boot + MySQL + JWT (repositorio `grip-backend`).

## Requisitos y puesta en marcha

1. Tener MySQL Server 8 instalado y en ejecución.
2. Preparar el usuario MySQL de la aplicación una sola vez siguiendo `README_INICIO_LOCAL.md` del repositorio backend.
3. Iniciar el backend. Al arrancar, crea la base `grip_sneaker_store` si no existe, crea o actualiza las tablas y carga el catálogo inicial si la tabla de productos está vacía.
4. En esta carpeta, ejecutar:

```powershell
npm ci
npm run dev
```

La aplicación queda en http://localhost:5173. El backend utiliza http://127.0.0.1:8080/api/v1.

Si el backend utiliza otra dirección, definir `VITE_API_URL` en un archivo local `.env.local`. No incluir contraseñas, tokens ni secretos en archivos versionados.

## Pruebas

```powershell
npm.cmd test
npm.cmd run build
```

## Autenticación y sesión

- Login y registro utilizan `/api/v1/auth`.
- La sesión se guarda en `sessionStorage`.
- Las cuentas iniciales de administrador y vendedor se crean desde el backend cuando se proporcionan las variables de contraseña correspondientes.
- Los clientes se registran desde `/registro`.

## Persistencia

- Productos, cuentas de autenticación, órdenes y líneas de orden se guardan en MySQL mediante el backend.
- Categorías, usuarios del panel y perfil mantienen el alcance local documentado en sus servicios actuales.
- El backend no reemplaza los datos existentes al reiniciar. El catálogo de demostración se inserta solo si la tabla de productos está vacía.

## Estructura

```
src/
  components/   atoms, molecules, organisms, templates
  pages/        tienda, admin
  context/      sesión (JWT) y carrito
  hooks/        useFormulario, useAvisoCarrito
  services/     api.js, *Api.js, *Service.js
  tests/        pruebas Jasmine
```
