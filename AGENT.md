# Guía principal para trabajar en adoptr-front

Este repositorio es la interfaz Next.js de Adoptr. Antes de editar, leer [arquitectura y prioridades técnicas](docs/arquitectura/lineamientos.md), [integración](docs/arquitectura/integracion.md) y [flujos de producto](docs/producto/flujos-producto.md). Distinguir contratos implementados de decisiones de producto por acordar.

## Reglas de trabajo

- Usar App Router: `src/app` para rutas y composición; `src/lib/api` para contratos/cliente; `src/lib/auth` para cookie de sesión solo servidor; `src/actions` para mutaciones. No exponer JWT en componentes cliente ni en `NEXT_PUBLIC_*`.
- Antes de crear una pantalla, confirmar si existe endpoint real en el backend (`../adoptr-back/docs/arquitectura/api.md`). No enlazar a rutas sin implementar como si fueran funcionales. Sincronizar los tipos TypeScript con el JSON del contrato vigente.
- Considerar `src/proxy.ts` solo guardia de navegación por presencia de cookie, no validación de JWT ni autorización. Mantener decisiones de acceso del lado servidor/backend y contemplar expiración/401.
- Conservar `globals.css` como origen de tokens de color/tipografía hasta definir un sistema visual; construir pantallas accesibles, responsive y con estados loading/empty/error. Evitar callbacks de Google dependientes del orden de carga del script.
- No poner secretos en variables públicas ni imprimir tokens/credenciales en consola. Revisar cookie `secure`/política de sesión para entornos locales y producción; no deshabilitar seguridad en producción para probar.
- Por cambio ejecutar `npm run lint`, `npx tsc --noEmit` y `npm run build` cuando haya dependencias instaladas; reportar bloqueos. Cubrir con pruebas los flujos críticos y reportar si aún no hay infraestructura para ejecutarlas.
- Al modificar arquitectura, contratos, prioridades o reglas de producto, **actualizar el documento existente** en `docs/arquitectura/` o `docs/producto/`; crear otro solo si hay un tema independiente y mantener los enlaces. No incorporar comprobaciones de un entorno personal como si fueran el estado de todo el equipo.

## Navegación

- Arquitectura y prioridades: [lineamientos](docs/arquitectura/lineamientos.md) · [integración con la API](docs/arquitectura/integracion.md)
- Producto: [flujos y decisiones abiertas](docs/producto/flujos-producto.md)
- [Inicio rápido](README.md)
