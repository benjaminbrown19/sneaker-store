# Especificación de Requisitos de Software (ERS) — V2
## GRIP Sneaker Store (React)

**Curso:** DSY1104 Desarrollo Fullstack II — Duoc UC
**Versión:** 2.0 (borrador para revisión del equipo)
**Integrantes:** Benjamín Brown ([@benjaminbrown19](https://github.com/benjaminbrown19)) · Litzy ([@litzy-1702](https://github.com/litzy-1702))
**Documento base:** `evaluacion-1/docs/ERS.md` (versión 1.0)

> Esta versión reemplaza las restricciones de la V1 (HTML, CSS y JavaScript vanilla). El proyecto se migró a React con React Router, Bootstrap y pruebas con Jasmine y Karma.

---

## 1. Introducción

### 1.1 Propósito
Especificar los requisitos funcionales y no funcionales de **GRIP Sneaker Store**, una tienda online de zapatillas. Sirve como referencia para el desarrollo, las pruebas y la evaluación parcial 2.

### 1.2 Ámbito del sistema
- **Tienda pública:** catálogo, categorías, ofertas, detalle de producto, carrito, checkout, registro, inicio de sesión, blogs, página institucional y formulario de contacto.
- **Panel administrativo:** acceso por rol (administrador y vendedor) con gestión de productos, categorías, órdenes, usuarios, reportes y venta en tienda.

El sistema **no incluye** backend, base de datos real, pasarela de pago ni envío de correos. Toda la persistencia se simula con `localStorage` del navegador.

### 1.3 Definiciones
| Término | Definición |
|---|---|
| RF | Requisito funcional |
| RNF | Requisito no funcional |
| RUN | Rol Único Nacional (identificador de persona en Chile) |
| Canal | Origen de la venta: `web` (cliente en línea) o `vendedor` (venta en tienda) |

---

## 2. Descripción general

### 2.1 Tecnologías
- React 19 y React Router 7, con Vite 7 como herramienta de compilación.
- Bootstrap 5.3 y React-Bootstrap para el diseño responsivo.
- Jasmine 5 y Karma 6 con React Testing Library para pruebas unitarias y de integración.
- `karma-coverage` (Istanbul) para el reporte de cobertura.

### 2.2 Roles
| Rol | Acceso |
|---|---|
| Cliente | Tienda pública, carrito, checkout y su perfil. |
| Vendedor | Lo anterior, más el panel en `/admin` (productos, órdenes) y **Venta en tienda** (`/admin/venta`). |
| Administrador | Acceso completo al panel, incluidos categorías, usuarios y reportes generales. |

El rol se define por el correo registrado al iniciar sesión.

### 2.3 Datos
Las entidades se guardan como listas en `localStorage` mediante los servicios de `src/services/`:
- `grip_productos`, `grip_categorias`, `grip_usuarios`, `grip_ordenes`.
- `grip_carrito`, `grip_cupon` y `grip_sesion` para el estado del usuario.

---

## 3. Requisitos funcionales

### 3.1 Tienda pública
- **RF-01** El sistema muestra la página de inicio, catálogo, categorías, ofertas, blogs, página institucional y contacto.
- **RF-02** El catálogo permite buscar productos por nombre o descripción y filtrar por categoría.
- **RF-03** El detalle de producto muestra nombre, código, precio, descuento y stock disponible.
- **RF-04** Un producto sin stock no puede añadirse al carrito.
- **RF-05** El carrito permite cambiar cantidades (sin superar el stock), quitar productos y vaciarlo. Su estado se conserva en `localStorage`.
- **RF-06** El carrito aplica cupones válidos (`GRIP10`, `GRIP20`) y rechaza los inválidos.
- **RF-07** El despacho es gratis desde $50.000 o con retiro en tienda; en otro caso cuesta $3.990.

### 3.2 Compra (checkout)
- **RF-08** El checkout pide datos del cliente, entrega (despacho o retiro en tienda) y forma de pago.
- **RF-09** Con retiro en tienda se ocultan los campos de dirección.
- **RF-10** El pago exige una tarjeta de 16 dígitos.
- **RF-11** Una tarjeta terminada en `0000` se rechaza para simular un pago fallido. Se muestra la vista de error y el carrito se conserva.
- **RF-12** Un pago exitoso registra la orden, descuenta el stock y muestra la boleta.
- **RF-13** Acceder a `/checkout` con el carrito vacío redirige al carrito.

### 3.3 Cuenta de usuario
- **RF-14** El registro valida nombre, correo, RUN (dígito verificador módulo 11) y contraseña. Un RUN o correo duplicado se rechaza.
- **RF-15** El inicio de sesión valida el formato del correo (dominios `duoc.cl`, `profesor.duoc.cl` y `gmail.com`) y una contraseña de 4 a 10 caracteres. Credenciales inválidas muestran una alerta.
- **RF-16** El cierre de sesión borra la sesión activa.

### 3.4 Panel administrativo
- **RF-17** Acceder a `/admin` sin sesión, o con rol cliente, redirige al inicio de sesión.
- **RF-18** Un vendedor no accede a las vistas exclusivas de administrador (por ejemplo, usuarios). Se le redirige a productos.
- **RF-19** Gestión de productos: crear, editar, eliminar (solo con confirmación) y listar. Un producto con stock igual o menor al stock crítico se marca como crítico.
- **RF-20** Gestión de categorías: crear, editar y eliminar. No se puede eliminar una categoría que tiene productos.
- **RF-21** Gestión de usuarios: crear, editar, ver detalle e historial de compras.
- **RF-22** Órdenes y boletas: listar órdenes y ver el detalle de una boleta.
- **RF-23** Reportes de productos y reportes generales, ambos solo para administrador.
- **RF-24** Venta en tienda (vendedor): se elige cliente, productos y forma de pago (efectivo, débito o crédito). Con tarjeta se piden los 4 últimos dígitos y un código de autorización de 4 a 8 dígitos; con crédito, las cuotas.
- **RF-25** Una venta en tienda queda registrada con canal `vendedor`, datos del vendedor y forma de pago. Con tarjeta se muestra un comprobante.

### 3.5 Rutas no válidas
- **RF-26** Una ruta inexistente muestra la página 404.

---

## 4. Requisitos no funcionales
- **RNF-01 Responsividad:** el diseño se adapta a móviles, tabletas y escritorios con las clases de Bootstrap.
- **RNF-02 Mantenibilidad:** los componentes siguen la estructura atoms → molecules → organisms → templates, con props y estado acotados a cada componente.
- **RNF-03 Calidad:** el proyecto cuenta con pruebas automatizadas que se ejecutan con `npm test` y generan reporte de cobertura.
- **RNF-04 Persistencia:** los datos sobreviven a una recarga de página mediante `localStorage`.
- **RNF-05 Compatibilidad:** la aplicación funciona en navegadores modernos compatibles con ES modules.

---

## 5. Restricciones
- No hay servidor ni API externa; toda la persistencia es local al navegador.
- Los pagos y los datos de tarjeta son simulados. No se procesan pagos reales ni se almacenan datos sensibles.
- El inicio de sesión es simulado.

---

## 6. Trazabilidad con las pruebas

| Requisito | Pruebas que lo verifican |
|---|---|
| RF-02, RF-03 | `Navegacion.integracion.spec.jsx`, `ListaProductos.spec.jsx`, `TarjetaProducto.spec.jsx` |
| RF-04, RF-05 | `ItemCarrito.spec.jsx`, `CarritoContext.spec.jsx` |
| RF-06 | `FormularioCupon.spec.jsx`, `CarritoContext.spec.jsx` |
| RF-07 | `ResumenCompra.spec.jsx`, `carrito-utils.spec.js` |
| RF-08 a RF-12 | `FormularioCheckout.spec.jsx`, `Compra.integracion.spec.jsx` |
| RF-14, RF-15 | `FormularioUsuario.spec.jsx`, `FormularioLogin.spec.jsx`, `validaciones.spec.js`, `SesionContext.spec.jsx` |
| RF-17, RF-18 | `Navegacion.integracion.spec.jsx`, `Admin.integracion.spec.jsx` |
| RF-19 a RF-21 | `FormularioProducto.spec.jsx`, `TablaProductos.spec.jsx`, `productosService.spec.js`, `usuariosService.spec.js`, `Admin.integracion.spec.jsx` |
| RF-22, RF-23 | `ordenesService.spec.js`, `Navegacion.integracion.spec.jsx` |
| RF-24, RF-25 | `VentaTienda.spec.jsx` |
| Hook de aviso del carrito | `useAvisoCarrito.spec.jsx` |

> Las vistas de administración con flujos de formulario (creación, edición y mensajes de error de usuarios y categorías) tienen cobertura parcial. Se documenta en el informe de cobertura.

---

## 7. Pendientes
- Pruebas de extremo a extremo en navegador real (fuera del alcance del repositorio).
- Pruebas de los flujos de envío de los formularios de categorías y usuarios del panel.
- Suscripción al boletín del pie de página.
