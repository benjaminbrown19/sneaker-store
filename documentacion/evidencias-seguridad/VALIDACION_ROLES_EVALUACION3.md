# GRIP — Validación de permisos y roles (Evaluación 3)

## Objetivo

Documentar los permisos que realmente implementan el frontend y el backend, y separar las verificaciones manuales comunicadas de las comprobaciones que solo se han revisado en el código.

## Matriz de permisos vigente

| Rol | Operaciones autorizadas |
| --- | --- |
| Visitante / cliente | Navegar la tienda y utilizar el checkout público \`POST /api/v1/ordenes/checkout\`. No puede consultar las órdenes internas ni acceder al panel. |
| Vendedor | Consultar productos; consultar órdenes y boletas; acceder a su perfil; registrar ventas desde \`/admin/venta\` mediante \`POST /api/v1/ordenes\`. No puede crear, editar ni eliminar productos ni administrar categorías, usuarios o reportes exclusivos. |
| Administrador | Acceso al panel completo; consulta de órdenes; registro de ventas; creación, edición y eliminación de productos; módulos administrativos locales. |

La autorización backend está definida en \`SecurityConfig.java\`:

- \`GET /api/v1/ordenes/**\`: roles \`ADMINISTRADOR\` y \`VENDEDOR\`.
- \`POST /api/v1/ordenes\`: roles \`ADMINISTRADOR\` y \`VENDEDOR\`.
- \`POST /api/v1/ordenes/checkout\`: público.
- Mutaciones de \`/api/v1/productos/**\`: solo \`ADMINISTRADOR\`.

En frontend, \`App.jsx\`, \`RutaPorRol.jsx\` y \`MenuLateralAdmin.jsx\` aplican la visibilidad y protección de rutas.

## Casos y resultados

| ID | Actor / acción | Resultado esperado | Evidencia / estado |
| --- | --- | --- | --- |
| SEG-01 | Vendedor abre \`/admin/venta\`. | Acceso permitido y formulario de venta disponible. | Confirmado mediante la venta presencial comunicada y la ruta habilitada para ambos roles. |
| SEG-02 | Vendedor envía una venta válida a \`POST /api/v1/ordenes\`. | HTTP 201 Created; orden registrada y stock actualizado. | HTTP 201 comunicado durante la validación manual. La venta apareció en el sistema y el stock de SNK-001 quedó en 15 unidades después de la venta posterior comunicada. |
| SEG-03 | Vendedor consulta \`GET /api/v1/ordenes\` y el detalle de una orden. | Acceso permitido. | Permiso confirmado en \`SecurityConfig.java\`; la consulta de órdenes y boletas fue comunicada como verificada manualmente. |
| SEG-04 | Vendedor intenta crear, editar o eliminar productos mediante la API. | HTTP 403 Forbidden. | Regla confirmada por inspección de \`SecurityConfig.java\`; no se adjunta una ejecución HTTP 403 independiente. |
| SEG-05 | Cliente intenta consultar órdenes internas o abrir rutas administrativas. | Acceso denegado o redirección fuera del panel. | Regla confirmada en la configuración de seguridad y las rutas frontend; no se adjunta una prueba HTTP independiente. |
| SEG-06 | Administrador registra una venta interna. | Acceso permitido; con solicitud válida, HTTP 201 Created. | Permiso confirmado en \`SecurityConfig.java\`; no se presenta como una nueva ejecución manual en este documento. |

## Interpretación correcta del endpoint de venta

**No debe esperarse HTTP 403 cuando un vendedor autenticado registra una venta válida en \`POST /api/v1/ordenes\`.** El backend autoriza expresamente a los roles administrador y vendedor. El resultado manual comunicado fue HTTP 201 Created.

El endpoint público de checkout es distinto: \`POST /api/v1/ordenes/checkout\`. Este fuerza el canal \`online\` y no debe utilizarse para atribuir una venta a un vendedor.

## Alcance de la evidencia

- La venta del vendedor con respuesta HTTP 201 y la actualización de stock son verificaciones manuales comunicadas durante el trabajo.
- Las pruebas Jasmine/Karma del frontend simulan las solicitudes \`fetch\`; no prueban por sí solas la autorización HTTP real del backend.
- El repositorio backend contiene dos pruebas unitarias de \`ProductoService\`; no contiene una suite automatizada específica para autorización JWT de órdenes.
- Los casos SEG-04 y SEG-05 describen el resultado que exige el código actual, pero no deben presentarse como pruebas HTTP ejecutadas si no se realiza y conserva esa evidencia.

## Seguridad de las evidencias

No incluir JWT, refresh tokens, cookies, contraseñas, archivos \`.env\`, datos personales reales ni capturas que expongan credenciales. Para una comprobación HTTP, usar cuentas y datos de prueba controlados.
