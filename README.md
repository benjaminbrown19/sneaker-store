# GRIP Sneaker Store

Tienda online de zapatillas desarrollada como proyecto semestral para el ramo **DSY1104 — Desarrollo Fullstack II**, Duoc UC.

Proyecto 100% frontend (sin backend real): HTML5 semántico, CSS3 personalizado (con Bootstrap 5.3 disponible vía CDN), y JavaScript Vanilla, con persistencia de datos vía `localStorage`.

---

## Integrantes

| Integrante | GitHub | Áreas principales |
|---|---|---|
| Benjamín Brown | [@benjaminbrown19](https://github.com/benjaminbrown19) | Tienda pública: Home, Catálogo, Detalle, Carrito, Blog |
| Litzy | [@litzy-1702](https://github.com/litzy-1702) | Autenticación, Contacto, Panel administrativo y roles |

---

## Funcionalidades principales

**Tienda pública**
- Catálogo dinámico con filtros por categoría y orden por precio.
- Detalle de producto individual (según el producto seleccionado).
- Carrito de compras con control de stock, subtotales/total y persistencia en `localStorage`.
- Registro y login simulados, con validación de RUN chileno (dígito verificador real) y de dominio de correo.
- Blog, sección "Nosotros" (con video institucional) y formulario de Contacto.

**Panel administrativo** (`/pages/admin`)
- Simulación de 3 roles: **Administrador**, **Vendedor** y **Cliente**, con distintos niveles de acceso.
- Gestión de productos: crear, editar y alerta de stock crítico.
- Gestión de usuarios: listado combinado (usuarios semilla + registrados) y creación.

---

## Cómo ejecutarlo

No requiere instalación ni servidor: es un proyecto 100% estático.

1. Clona o descarga el repositorio.
2. Abre `index.html` directamente en tu navegador (doble click), **o** usa una extensión tipo "Live Server" en VS Code para evitar restricciones de algunos navegadores con `file://`.

---

## Cuentas de prueba

Como no hay backend, cualquier contraseña de 4 a 10 caracteres funciona. El **rol** de la sesión depende del correo ingresado:

| Correo | Rol |
|---|---|
| `ana.perez@duocuc.cl` | Administrador (acceso total al panel) |
| `carlos.soto@duocuc.cl` | Vendedor (solo ve el catálogo, sin crear/editar) |
| Cualquier otro correo válido | Cliente (sin acceso al panel admin) |

Dominios de correo aceptados en todo el sitio: `@duocuc.cl`, `@profesor.duocuc.cl`, `@gmail.com`, `@hotmail.com`, `@outlook.com`.

---

## Tecnologías

- HTML5 semántico
- CSS3 (sistema de diseño propio — ver sección siguiente) + Bootstrap 5.3 (CDN)
- JavaScript Vanilla (sin frameworks ni librerías de UI)
- Git / GitHub para control de versiones colaborativo

### Sistema de diseño — "Tracción urbana"
- **Color:** fondo asfalto oscuro (`#1B1C20`), acento amarillo de seguridad (`#F5C518`), azul cancha (`#3452FF`) como secundario.
- **Tipografía:** Bebas Neue (títulos), Work Sans (cuerpo), IBM Plex Mono (precios, stock, códigos).
- **Firma visual:** franja diagonal tipo "suela", hecha 100% en CSS, usada en el hero, el footer y las tarjetas de producto.

---

## Estructura del proyecto

```
sneaker-store/
├── index.html
├── pages/                  # 10 páginas públicas + carpeta admin/ (6 páginas)
├── css/                    # style.css (tienda) + admin.css (panel admin)
├── js/                     # 1 archivo por responsabilidad (ver detalle abajo)
├── data/                   # productos.js, regiones.js, usuarios.js
├── assets/                 # imágenes (SVG propias), íconos, video
└── docs/
    └── ERS.md              # Especificación de Requisitos de Software (IEEE 830)
```

### Organización de `js/`

| Archivo | Responsabilidad |
|---|---|
| `main.js` | Menú móvil, contador del carrito, sesión activa en el header |
| `productos.js` | Renderizado dinámico del catálogo y destacados |
| `detalle.js` | Renderizado dinámico del detalle de producto |
| `carrito.js` | Lógica del carrito + `localStorage` |
| `validaciones.js` | Validaciones reutilizables (email, RUN, textos, contraseña) |
| `login.js` / `registro.js` / `contacto.js` | Validación y simulación de cada formulario |
| `regiones-comunas.js` | Comuna dinámica según región |
| `roles.js` | Simulación de permisos del panel admin |
| `admin-productos.js` / `admin-usuarios.js` | CRUD simulado del panel admin |

---

## Documentación adicional

- [`docs/ERS.md`](docs/ERS.md) — Especificación de Requisitos de Software (formato IEEE 830), con requisitos funcionales/no funcionales numerados y matriz de trazabilidad.

---

## Notas y limitaciones conocidas

- **No hay backend real.** Los roles, el login y el CRUD del panel admin son simulaciones en el cliente (JavaScript + `localStorage`), documentado así explícitamente por restricción del alcance del curso.
- Las imágenes de producto y el video institucional de la sección "Nosotros" fueron generados con herramientas de IA para efectos de esta entrega académica, ya que el proyecto no cuenta con fotografía/video propios de producto.

---

## Licencia

Proyecto académico desarrollado para fines educativos — DSY1104 Desarrollo Fullstack II, Duoc UC.
