# GRIP Sneaker Store (React)

Tienda online de zapatillas desarrollada para DSY1104 (Evaluación Parcial 2). Migración a React del sitio de la Evaluación 1, con diseño responsivo en Bootstrap, datos persistidos en `localStorage` y pruebas unitarias con Jasmine y Karma.

## Tecnologías

- React 19 y React Router 7
- Vite 7
- Bootstrap 5 y React-Bootstrap
- Jasmine, Karma y React Testing Library

## Cómo ejecutar

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Pruebas

```bash
npm test
```

Ejecuta las pruebas en Chrome Headless y genera el reporte de cobertura en `coverage/index.html`. Si Chrome no está en la ruta por defecto, definir `CHROME_BIN` con la ruta del ejecutable.

## Estructura

```
src/
  components/   atoms, molecules, organisms, templates
  pages/        tienda, admin
  context/      sesión y carrito
  hooks/        useFormulario, useAvisoCarrito
  services/     CRUD sobre localStorage
  data/         datos iniciales
  utils/        formato, validaciones, cálculo del carrito
  tests/        pruebas Jasmine
```

## Cuentas de prueba

El inicio de sesión es simulado: se valida el formato del correo (dominios duoc.cl, profesor.duoc.cl y gmail.com) y una contraseña de 4 a 10 caracteres. El rol lo define el correo registrado.

| Rol           | Correo                    |
| ------------- | ------------------------- |
| Administrador | ana.perez@duoc.cl         |
| Vendedor      | carlos.soto@duoc.cl       |
| Cliente       | valentina.munoz@gmail.com |

## Reglas del checkout

- Despacho gratis desde $50.000 o con retiro en tienda; en otro caso cuesta $3.990.
- Cupones disponibles: `GRIP10` y `GRIP20`.
- Una tarjeta terminada en `0000` es rechazada para simular un pago fallido.
