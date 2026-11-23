# GRIP SNEAKER STORE
# Validación de permisos y seguridad — Evaluación 3

## 1. Información general

- Proyecto: GRIP Sneaker Store.
- Asignatura: Desarrollo Fullstack II.
- Evaluación: Examen Final Transversal — Evaluación 3.
- Fecha de ejecución de las pruebas: 23 de noviembre de 2026.
- Fecha de entrega: 24 de noviembre de 2026.
- Entorno: Local.
- Backend: Spring Boot.
- Frontend: React + Vite.
- Base de datos: MySQL.
- Documentación API: Swagger UI.

## 2. Objetivo

Complementar la evidencia de testing del proyecto GRIP Sneaker Store mediante pruebas de seguridad y autorización, verificando que los usuarios puedan ejecutar únicamente las operaciones permitidas según su rol.

Se busca comprobar específicamente la restricción de acceso a la operación interna de registro de ventas mediante la API REST:

\`POST /api/v1/ordenes\`

Además, se verifica que las operaciones autorizadas permitan registrar órdenes correctamente en MySQL y actualizar el inventario de productos.

## 3. Reglas de autorización

De acuerdo con los permisos funcionales definidos para GRIP, se establecen las siguientes restricciones:

| Rol | Registrar ventas en tienda |
|---|---|
| Administrador | PERMITIDO |
| Vendedor | PERMITIDO |
| Cliente | DENEGADO |

El Administrador y el Vendedor pueden realizar ventas presenciales desde la aplicación. El Cliente no tiene autorización para utilizar esta operación interna.

## 4. Preparación del entorno

Para ejecutar las pruebas se realizaron las siguientes acciones:

1. Se inició el servicio MySQL.
2. Se inició el backend Spring Boot con las variables de entorno correspondientes.
3. Se inició el frontend React.
4. Se verificó la comunicación entre frontend, backend y base de datos.
5. Se utilizaron cuentas autenticadas de Cliente, Vendedor y Administrador.
6. Se obtuvieron los JWT mediante el flujo normal de autenticación.
7. Se utilizó Swagger UI para ejecutar las peticiones HTTP.
8. Se verificaron las órdenes y los productos mediante consultas GET.

Los tokens JWT se utilizaron únicamente durante las pruebas locales y no se incorporaron a este documento ni al repositorio.

## 5. Casos de prueba de seguridad

### SEG-01 — Cliente no puede registrar venta interna

- Actor: Cliente autenticado.
- Acción: enviar una petición POST \`/api/v1/ordenes\` utilizando el JWT de un Cliente.
- Resultado esperado: HTTP 403 Forbidden.
- Resultado observado: HTTP 403 Forbidden.
- Análisis: el backend rechazó correctamente la solicitud porque el usuario autenticado no cuenta con los permisos necesarios para registrar ventas internas.
- Evidencia: captura de Swagger mostrando la respuesta HTTP 403.
- Estado: APROBADO.

### SEG-02 — Vendedor puede registrar venta interna

- Actor: Vendedor autenticado.
- Acción: enviar una petición POST \`/api/v1/ordenes\` utilizando el JWT de un Vendedor y un cuerpo de solicitud válido.
- Resultado esperado: operación autorizada y creación de la orden.
- Resultado observado: HTTP 201 Created.

**Datos de la venta de prueba:**

- Identificador de orden: \`ORD-a94b3dbb-87fd-4988-a504-5dfa949f4180\`.
- Producto: GRIP Street 90.
- Código: SNK-001.
- Cantidad: 1 unidad.
- Precio unitario: $54.990.
- Método de pago: efectivo.
- Canal: vendedor.
- Estado de la orden: pagada.

**Verificación en base de datos:**

Se consultó GET \`/api/v1/ordenes\` y se comprobó que la orden quedó registrada correctamente.

También se consultó GET \`/api/v1/productos\` para comprobar la actualización del inventario:

- Stock inicial: 16 unidades.
- Unidades vendidas: 1.
- Stock final: 15 unidades.

**Análisis:** el backend autorizó correctamente al Vendedor, creó la orden, registró la venta y actualizó el inventario en MySQL.

- Evidencias:
  - Captura de Swagger con HTTP 201.
  - Captura de GET \`/api/v1/ordenes\` mostrando la orden registrada.
  - Captura de GET \`/api/v1/productos\` mostrando el stock actualizado.
- Estado: APROBADO.

### SEG-03 — Administrador puede registrar venta interna

- Actor: Administrador autenticado.
- Acción: enviar una petición POST \`/api/v1/ordenes\` utilizando el JWT de un Administrador y un cuerpo de solicitud válido.
- Resultado esperado: operación autorizada y creación de la orden.
- Resultado observado: HTTP 201 Created.

**Datos de la venta de prueba:**

- Producto: GRIP Slide Skate.
- Código: SNK-004.
- Cantidad: 1 unidad.
- Precio unitario: $49.990.
- Método de pago: efectivo.
- Canal: vendedor.

**Verificación en base de datos:**

Se consultó GET \`/api/v1/ordenes\` y se comprobó que la venta aparece registrada correctamente.

Posteriormente, se consultó GET \`/api/v1/productos\` y se confirmó que el inventario disminuyó en una unidad.

- Stock inicial: 25 unidades.
- Unidades vendidas: 1.
- Stock final: 24 unidades.

**Análisis:** el backend autorizó correctamente al Administrador, registró la orden y actualizó el inventario en MySQL.

- Evidencias:
  - Captura de Swagger con HTTP 201.
  - Captura de GET \`/api/v1/ordenes\` mostrando la orden registrada.
  - Captura de GET \`/api/v1/productos\` mostrando el stock actualizado.
- Estado: APROBADO.

## 6. Validación complementaria del frontend

Se realizaron pruebas manuales de acceso a las funcionalidades de venta según el rol autenticado.

**Vendedor:**
- Puede visualizar la opción «Vender en tienda».
- Puede ingresar a la pantalla de ventas.
- Puede acceder directamente a la ruta \`/admin/venta\` cuando mantiene una sesión activa en la pestaña original.
- Puede realizar ventas presenciales.

**Administrador:**
- Puede acceder a las funcionalidades administrativas.
- Puede ingresar a Venta en tienda.
- Puede registrar ventas presenciales.

**Cliente:**
- No tiene autorización para utilizar la funcionalidad de Venta en tienda.
- No puede registrar ventas internas mediante la interfaz.

**Observación sobre las sesiones:**

Al abrir directamente la ruta \`/admin/venta\` en una pestaña nueva, la aplicación solicita iniciar sesión nuevamente. Esto ocurre porque la autenticación utiliza \`sessionStorage\`, cuyo almacenamiento de sesión es independiente para cada pestaña.

Este comportamiento corresponde a la gestión de sesiones del frontend y no constituye una denegación de permisos al rol Vendedor.

## 7. Resultados de testing automatizado del frontend

Se ejecutó el conjunto de pruebas automatizadas mediante Karma y Chrome Headless.

**Resultado de ejecución:**

- Pruebas ejecutadas: 177.
- Pruebas aprobadas: 177.
- Pruebas fallidas: 0.
- Resultado general: SUCCESS.

**Cobertura de código:**

| Métrica | Cobertura |
|---|---:|
| Statements | 83,14 % |
| Branches | 68,49 % |
| Functions | 82,75 % |
| Lines | 86,42 % |

Durante la ejecución aparecieron advertencias de React relacionadas con actualizaciones de estado fuera de \`act(...)\` y una advertencia de obsolescencia de Node.js (\`util._extend\`).

Estas advertencias no impidieron la ejecución de las pruebas ni provocaron fallos.

## 8. Compilación de producción

Se ejecutó el comando:

\`npm.cmd run build\`

**Resultado: EXITOSO.**

- Herramienta: Vite 7.3.7.
- Módulos transformados: 288.
- Archivos de producción generados correctamente.
- Errores de compilación: 0.

La compilación confirma que el frontend puede generar correctamente su versión de producción.

## 9. Relación con las pruebas unitarias del backend

Las pruebas HTTP de autorización documentadas en este informe son complementarias a las pruebas unitarias del backend.

El proyecto contempla 2 pruebas unitarias de backend, las cuales deben mantenerse documentadas mediante su respectivo registro de ejecución.

Las pruebas manuales SEG-01, SEG-02 y SEG-03 no se contabilizan como pruebas unitarias ni automatizadas.

## 10. Resultado general

**RESULTADO: APROBADO.**

Se comprobó satisfactoriamente el funcionamiento de las restricciones de autorización para el registro de ventas internas de GRIP Sneaker Store.

Los resultados obtenidos fueron:

- Cliente: HTTP 403 Forbidden. El backend rechaza correctamente el registro de ventas internas.
- Vendedor: HTTP 201 Created. El backend permite registrar ventas presenciales y actualiza el inventario.
- Administrador: HTTP 201 Created. El backend permite registrar ventas presenciales y actualiza el inventario.

También se comprobó la persistencia de las órdenes en MySQL y la actualización de las existencias de los productos.

Las pruebas automatizadas del frontend finalizaron con 177 de 177 casos aprobados y la compilación de producción se ejecutó correctamente.

En consecuencia, se valida que los permisos de registro de ventas corresponden a las reglas funcionales definidas para los roles Administrador, Vendedor y Cliente.
