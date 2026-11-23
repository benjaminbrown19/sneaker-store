# GRIP frontend - Integración REST (Evaluación 3)

## Arranque

`npm install` y `npm run dev` (http://localhost:5173).

El backend debe estar en `http://localhost:8080`; ajustar `VITE_API_URL` en `.env.local` si cambia. No subir secretos.

## Implementado en este ZIP

- Catálogo `/productos` consulta GET de Spring Boot, sin reemplazar el diseño.
- Administración `/admin/productos` consulta y elimina vía API; `/admin/productos/nuevo` y edición usan POST y PUT.
- Inicio de sesión y registro comunicados con `/api/v1/auth`; persistencia de sesión en `sessionStorage` y reintento tras renovar JWT.
- Menú y rutas de vendedor adaptados al Anexo 1 (productos/órdenes consultables).

## Limitaciones importantes

- Algunas páginas anteriores (ofertas, checkout, inventario crítico, órdenes y categorías) siguen usando servicios locales de Evaluación 2. Se actualiza una copia local de los productos al consultar REST para mantener compatibilidad con carrito, detalles y componentes antiguos. Se mantienen para no borrar funcionalidades previas; no se debe afirmar integración REST completa de toda la tienda.
- Backend exige JWT para mutaciones de productos, así que para crear/editar/eliminar se requiere iniciar sesión como administrador.
- `sessionStorage` persiste durante recargas de la misma pestaña, pero no permite revocar tokens ya emitidos; para despliegue real se recomienda cookie HttpOnly, TLS y refresh revocable.
- La base de datos puede iniciar sin catálogo: usar `grip-backend/sql/02_productos_iniciales.sql` si se requiere precargar productos.
- No se ha verificado compilación ni test desde esta entrega si el entorno no permite descargar npm/Maven. Validar en VS Code antes de subir a main.
