# GRIP Sneaker Store — Validación de permisos (Evaluación 3)



## Objetivo
Complementar la evidencia de testing del proyecto, comprobando en el backend la restricción de acceso a la operación interna de registro de ventas. El informe de cobertura final señala que falta evidencia HTTP 403 con token de vendedor. Este documento es una plantilla de evidencia, no una prueba ejecutada.

## Preparación
1. Iniciar MySQL y backend localmente con las variables de entorno configuradas fuera de GitHub.
2. Iniciar sesión como vendedor desde el flujo real de autenticación de la aplicación.
3. Obtener el token JWT de esa sesión **solo para la prueba local**. Nunca copiarlo al repositorio ni a las capturas.
4. Identificar en Swagger la operación `POST /api/v1/ordenes` y revisar el contrato del cuerpo de solicitud antes de ejecutar.

## Caso SEG-01 — Vendedor no puede registrar venta interna
- **Actor:** vendedor autenticado.
- **Acción:** enviar `POST /api/v1/ordenes` con su JWT y un cuerpo válido para la operación.
- **Resultado esperado:** HTTP **403 Forbidden**.
- **Resultado observado:** [PENDIENTE: escribir código HTTP y fecha].
- **Evidencia:** [PENDIENTE: captura sin JWT, contraseñas ni datos personales].
- **Estado:** [PENDIENTE / APROBADO / FALLIDO].

## Caso SEG-02 — Administrador sí tiene permiso
- **Actor:** administrador autenticado.
- **Acción:** ejecutar la misma operación con un JWT de administrador y datos de prueba controlados.
- **Resultado esperado:** la petición no es rechazada por permisos; el código exacto depende de la validez del cuerpo y reglas de negocio.
- **Resultado observado:** [PENDIENTE].
- **Evidencia:** [PENDIENTE].
- **Estado:** [PENDIENTE / APROBADO / FALLIDO].
- **Precaución:** esta operación puede crear una orden real. Usar datos de prueba y registrar cualquier cambio para poder revertirlo de manera segura.

## Caso SEG-03 — Ruta frontend bloqueada
- **Actor:** vendedor autenticado.
- **Acción:** intentar abrir directamente `http://localhost:5173/admin/venta`.
- **Resultado esperado:** no acceder al formulario de registrar venta.
- **Resultado observado:** [PENDIENTE; confirmar que la sesión de vendedor sigue activa].
- **Estado:** [PENDIENTE / APROBADO / FALLIDO].

## Registro de ejecución
- Responsable: [Litzy — confirmar nombre de autoría en Git]
- Fecha y hora: [24/11/2026 12:10]
- Versión frontend (commit): [74a1b3f]
- Versión backend (commit): [79fd451]
- Resultado general: [OK]
- Incidencias y acciones: [SIN INCIDENCIA]

## Relación con los entregables
Esta evidencia complementa el **documento de cobertura de testing actualizado**, que forma parte de los entregables del Examen Final. No sustituye las 178 pruebas automatizadas frontend ni las 2 pruebas unitarias backend, y no debe contabilizarse como prueba aprobada hasta su ejecución.

**Seguridad:** no subir JWT, cookies, contraseñas, archivos `.env`, nombres de clientes reales ni capturas con información sensible.
