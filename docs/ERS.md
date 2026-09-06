# Especificación de Requisitos de Software (ERS)
## GRIP Sneaker Store — Formato IEEE 830

**Curso:** DSY1104 Desarrollo Fullstack II — Duoc UC
**Versión:** 1.0
**Integrantes:** Benjamín Brown ([@benjaminbrown19](https://github.com/benjaminbrown19)) · Litzy ([@litzy-1702](https://github.com/litzy-1702))

---

## 1. Introducción

### 1.1 Propósito
Este documento especifica los requisitos funcionales y no funcionales del sistema **GRIP Sneaker Store**, una tienda online de zapatillas desarrollada como proyecto semestral. Su propósito es servir de referencia técnica para el desarrollo, las pruebas y la evaluación del proyecto, y como guía para la defensa oral del mismo.

### 1.2 Ámbito del Sistema
El sistema comprende:

- Una **tienda pública** donde cualquier visitante puede explorar el catálogo, ver el detalle de un producto, gestionar un carrito de compras, registrarse, iniciar sesión, leer contenido de blog/institucional y enviar un formulario de contacto.
- Un **panel administrativo** de acceso restringido, con simulación de roles (Administrador, Vendedor, Cliente), gestión de productos y gestión de usuarios.

El sistema **no incluye** backend, base de datos real, pasarela de pago, ni envío real de correos. Toda persistencia de datos generada por el usuario (carrito, sesión, registro de cuentas, productos/usuarios creados desde el panel admin) se simula mediante `localStorage` del navegador.

### 1.3 Definiciones, Acrónimos y Abreviaturas
| Término | Definición |
|---|---|
| RF | Requisito Funcional |
| RNF | Requisito No Funcional |
| RUN | Rol Único Nacional (identificador de persona en Chile) |
| DV | Dígito Verificador (último carácter del RUN) |
| SPA-like | Comportamiento dinámico en una página sin recargar, mediante JavaScript |
| `localStorage` | Mecanismo de almacenamiento persistente del navegador, del lado del cliente |

### 1.4 Referencias

- Documento de evaluación "DSY1104 — Evaluación Parcial N.º 1", Duoc UC.
- [Documentación de Bootstrap 5.3](https://getbootstrap.com/docs/5.3/)
- Servicio de Registro Civil e Identificación de Chile — algoritmo de cálculo del dígito verificador del RUN (módulo 11).

### 1.5 Visión General del Documento
Las secciones siguientes describen, en orden: la perspectiva general del producto (sección 2), y el detalle de los requisitos funcionales y no funcionales junto con su matriz de trazabilidad (sección 3).

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
GRIP Sneaker Store es un producto **nuevo e independiente**, sin integración con sistemas externos (no consume APIs de pago, envío ni inventario reales). Es un proyecto autocontenido, ejecutable abriendo sus archivos HTML directamente en un navegador.

### 2.2 Funciones del Producto
A alto nivel, el sistema permite:

- Explorar y filtrar un catálogo de productos.
- Agregar, modificar y eliminar productos de un carrito de compras persistente.
- Registrar una cuenta de usuario y autenticarse.
- Simular el uso de un panel administrativo con permisos diferenciados por rol.
- Consultar contenido informativo (blog, institucional) y contactar a la tienda.

### 2.3 Características de los Usuarios
| Tipo de usuario | Descripción | Acceso |
|---|---|---|
| Visitante / Cliente | Cualquier persona que navega la tienda | Catálogo, carrito, registro, login, blog, contacto |
| Vendedor | Personal simulado de la tienda | Todo lo anterior + panel admin (solo visualización de productos) |
| Administrador | Personal simulado con control total | Todo lo anterior + gestión completa de productos y usuarios |

### 2.4 Restricciones

- El proyecto debe implementarse únicamente con HTML5, CSS3, JavaScript Vanilla y Bootstrap (sin otros frameworks de frontend).
- No existe backend ni base de datos real: toda simulación de autenticación, roles y persistencia de datos ocurre en el cliente (`localStorage`), **sin constituir seguridad real**. Cualquier persona con conocimientos de JavaScript podría alterar dicha información directamente desde las herramientas de desarrollador del navegador.
- El versionamiento y trabajo colaborativo debe realizarse mediante Git y GitHub.

### 2.5 Suposiciones y Dependencias

- Se asume que el usuario final accede desde un navegador moderno (Chrome, Firefox o Edge actualizados) con JavaScript habilitado.
- El proyecto depende de la disponibilidad del CDN de Google Fonts y del CDN de Bootstrap (jsDelivr) para cargar tipografías y estilos; sin conexión a internet, el sitio sigue siendo funcional pero con las fuentes de reemplazo del sistema.

### 2.6 Requisitos Futuros
Quedan fuera del alcance de esta versión, pero se identifican como mejoras futuras razonables:

- Integración con un backend real y base de datos persistente.
- Pasarela de pago real.
- Subida real de imágenes de producto (actualmente simulada con una imagen genérica).
- Autenticación real con verificación de contraseña contra una base de datos.

---

## 3. Requisitos Específicos

### 3.1 Interfaces Externas

#### 3.1.1 Interfaces de Usuario
17 páginas HTML con navegación enlazada entre sí, formularios accesibles (etiquetas `label`, atributos `autocomplete`, mensajes de error visibles) y diseño responsive para dispositivos móviles, tablets y escritorio.

#### 3.1.2 Interfaces de Hardware
No aplica — el sistema no interactúa con hardware específico.

#### 3.1.3 Interfaces de Software

- Google Fonts (CDN) para las tipografías Bebas Neue, Work Sans e IBM Plex Mono.
- Bootstrap 5.3 (CDN, jsDelivr) disponible para uso de componentes en fases futuras del proyecto.

### 3.2 Requisitos Funcionales

| ID | Requisito |
|----|-----------|
| RF-001 | El sistema debe mostrar el catálogo de productos de forma dinámica, generado desde un arreglo JavaScript. |
| RF-002 | El sistema debe permitir ver el detalle completo de un producto seleccionado. |
| RF-003 | El sistema debe permitir agregar un producto al carrito desde el catálogo y desde el detalle. |
| RF-004 | El sistema debe permitir aumentar o disminuir la cantidad de un producto en el carrito. |
| RF-005 | El sistema debe permitir eliminar un producto del carrito. |
| RF-006 | El sistema debe calcular subtotales por producto y el total general del carrito. |
| RF-007 | El sistema debe validar que la cantidad solicitada no supere el stock disponible. |
| RF-008 | El sistema debe mostrar un estado de carrito vacío cuando corresponda. |
| RF-009 | El sistema debe persistir el carrito en `localStorage` entre sesiones. |
| RF-010 | El sistema debe permitir el registro de nuevos usuarios (rol Cliente). |
| RF-011 | El sistema debe validar el RUN ingresado, incluyendo el dígito verificador (módulo 11). |
| RF-012 | El sistema debe actualizar dinámicamente el listado de comunas según la región seleccionada. |
| RF-013 | El sistema debe permitir iniciar sesión mediante correo y contraseña. |
| RF-014 | El sistema debe validar que el correo pertenezca a los dominios permitidos (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`). |
| RF-015 | El sistema debe permitir enviar un formulario de contacto validado. |
| RF-016 | El sistema debe mostrar un blog con al menos 2 artículos y su detalle. |
| RF-017 | El sistema debe presentar información institucional de la tienda. |
| RF-018 | El sistema debe simular 3 roles de usuario (Administrador, Vendedor, Cliente). |
| RF-019 | El sistema debe restringir, según el rol, el acceso a las funciones administrativas. |
| RF-020 | El sistema debe permitir al Administrador crear nuevos productos. |
| RF-021 | El sistema debe permitir al Administrador editar productos existentes. |
| RF-022 | El sistema debe mostrar una alerta cuando el stock de un producto sea igual o inferior a su stock crítico. |
| RF-023 | El sistema debe permitir al Administrador visualizar el listado de usuarios. |
| RF-024 | El sistema debe permitir al Administrador crear nuevos usuarios. |
| RF-025 | Todos los formularios deben validarse mediante JavaScript, con mensajes de error personalizados. |

### 3.3 Requisitos No Funcionales

#### 3.3.1 Requisitos de Rendimiento (RNF-001)
El sitio debe cargar sin dependencias pesadas; solo Bootstrap y Google Fonts como recursos externos vía CDN.

#### 3.3.2 Requisitos de Seguridad (RNF-002)
Los controles de acceso por rol son una **simulación en el cliente**, sin constituir seguridad real, dado que el proyecto no cuenta con backend. Esta limitación es una decisión de alcance documentada, no un descuido.

#### 3.3.3 Requisitos de Fiabilidad (RNF-003)
Los datos guardados en `localStorage` (carrito, sesión, usuarios y productos creados) deben mantenerse íntegros entre recargas de página y cierres del navegador.

#### 3.3.4 Requisitos de Disponibilidad (RNF-004)
El sitio debe funcionar en su totalidad sin requerir un servidor propio ni conexión a un backend, más allá de los recursos de CDN mencionados en 3.1.3.

#### 3.3.5 Requisitos de Mantenibilidad (RNF-005)
El código JavaScript debe organizarse en archivos externos por responsabilidad (un archivo, un propósito), evitando duplicación de lógica entre archivos.

#### 3.3.6 Requisitos de Portabilidad (RNF-006)
El sitio debe visualizarse correctamente en navegadores modernos (Chrome, Firefox, Edge) y adaptarse de forma responsive a dispositivos móviles, tablets y pantallas de escritorio.

---

## 4. Matriz de Trazabilidad

| Requisito | Página | Archivo | Función |
|---|---|---|---|
| RF-001 | `productos.html` | `js/productos.js` | `renderizarCatalogo()` |
| RF-002 | `detalle-producto.html` | `js/detalle.js` | listener `DOMContentLoaded` |
| RF-003 | `productos.html`, `detalle-producto.html` | `js/carrito.js` | `agregarAlCarrito()` |
| RF-004 | `carrito.html` | `js/carrito.js` | `actualizarCantidadCarrito()` |
| RF-005 | `carrito.html` | `js/carrito.js` | `eliminarDelCarrito()` |
| RF-006 | `carrito.html` | `js/carrito.js` | `actualizarResumenCarrito()` |
| RF-007 | `carrito.html`, `detalle-producto.html` | `js/carrito.js` | `agregarAlCarrito()`, `actualizarCantidadCarrito()` |
| RF-008 | `carrito.html` | `js/carrito.js` | `renderizarCarrito()` |
| RF-009 | `carrito.html` | `js/carrito.js` | `guardarCarritoEnStorage()` |
| RF-010 | `registro.html` | `js/registro.js` | listener `submit` |
| RF-011 | `registro.html`, `admin/usuario-crear.html` | `js/validaciones.js` | `validarRUN()` |
| RF-012 | `registro.html`, `admin/usuario-crear.html` | `js/regiones-comunas.js` | `inicializarRegionComuna()` |
| RF-013 | `login.html` | `js/login.js` | listener `submit` |
| RF-014 | `login.html`, `registro.html`, `contacto.html` | `js/validaciones.js` | `validarEmail()` |
| RF-015 | `contacto.html` | `js/contacto.js` | listener `submit` |
| RF-016 | `blogs.html`, `blog-1.html`, `blog-2.html` | — (HTML estático) | — |
| RF-017 | `nosotros.html` | — (HTML estático) | — |
| RF-018 | `login.html` | `js/login.js` | `crearSesionParaCorreo()` |
| RF-019 | `admin/*.html` | `js/roles.js` | `aplicarPermisosDePagina()`, `aplicarPermisosVisuales()` |
| RF-020 | `admin/producto-crear.html` | `js/admin-productos.js` | `inicializarCrearProducto()` |
| RF-021 | `admin/producto-editar.html` | `js/admin-productos.js` | `inicializarEditarProducto()` |
| RF-022 | `admin/productos.html`, `admin/dashboard.html` | `js/admin-productos.js` | `renderizarTablaProductosAdmin()` |
| RF-023 | `admin/usuarios.html` | `js/admin-usuarios.js` | `renderizarTablaUsuariosAdmin()` |
| RF-024 | `admin/usuario-crear.html` | `js/admin-usuarios.js` | listener `submit` |
| RF-025 | Todos los formularios | `js/validaciones.js` | `mostrarError()`, `limpiarError()` |
