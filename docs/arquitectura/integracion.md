# Integración con backend — contrato vigente en el repositorio

El frontend usa server actions y llamadas `fetch` desde código `server-only`; no hay API route/BFF adicional. Base configurada mediante `API_URL`, variable obligatoria solo del servidor (localmente: `http://localhost:8081`). Ver [API backend](../../../adoptr-back/docs/arquitectura/api.md) para respuestas y limitaciones reales.

| Uso | Código frontend | Backend | Estado |
| --- | --- | --- | --- |
| Login Google | `page.tsx` → `loginAction` → `calls/auth.ts` | `POST /auth/oauth` sin Bearer, JSON `{token,provider:"google"}` | Única integración HTTP actual. Backend retorna `{token,user}`; la action guarda `token` en cookie **y devuelve `Auth` completo al cliente, incluido JWT**. El validador backend no comprueba issuer/audience; ver [API backend](../../../adoptr-back/docs/arquitectura/api.md). |
| Perfil | `src/proxy.ts` comprueba cookie en la ruta exacta `/profile` | `GET /profile` requiere Bearer | **No consumido por la UI.** Con el JWT emitido hoy, el filtro fija el nombre (`String`) como principal y el servicio lo castea a `Long`; falla antes de consultar perfil. La página es un placeholder. |
| Creación de perfil | No hay formulario/llamada | `POST /profile` | Backend stub: no persiste. No implementar cliente suponiendo éxito real. |
| Publicaciones y ubicaciones | Solo modelos de localidad/perfil en `src/lib/api/models` | Sin endpoints | No existen llamadas, listados ni navegación real. |

## Sesión y modelos

- Google entrega **ID token** al callback cliente. El frontend lo envía al backend mediante server action. Backend devuelve **JWT Adoptr** distinto; `setAccessToken` lo guarda HttpOnly/SameSite Strict/Secure. **El contrato actual de `loginAction` retorna `Auth` entero al cliente, JWT incluido**, aunque la página no use el valor retornado: es una filtración del límite servidor/cliente a corregir. El callback además registra en consola la respuesta Google con `credential`. Objetivo: no devolver JWT ni registrar tokens en el navegador. `apiRequest` lee cookie en servidor y agrega Bearer solo si hay token; con `requiresAuth=true` sin cookie no detiene la petición. Hoy solo se invoca para login con `requiresAuth=false`.
- Backend configura expiración JWT de 1 h; la cookie no tiene TTL explícito. `proxy.ts` solo mira presencia, no expiración ni revocación. Una solicitud posterior puede recibir 401/otro error; tratar estado de sesión y redirección de forma coherente al implementar datos protegidos.
- Alinear modelos antes de usarlos: IDs `Long` serializados como `number` (no `string`); `createdAt` es cadena ISO serializada (no objeto `Date`); `User.profile` puede ser `null`; campo de perfil backend `genderType`, no `gender`. La forma de error backend es `{code:string,message:string}` para excepciones gestionadas, pero errores de Spring Security pueden diferir.
- `src/lib/api/api.ts` devuelve `{ data, headers: { totalCount, contentType } }` para status 2xx; no hay contrato de paginación implementado ni header `x-total-count` emitido por controllers actuales. No fija timeout/cache; en error intenta parsear JSON, hace log del payload y lanza solo `Error(message)`, perdiendo status/code (y error genérico si no hay JSON). Antes de nuevas llamadas protegidas definir error tipado/sanitizado y estrategia de 401, cuerpos no JSON, red/timeout y caché privada; no asumir un formato de error estable de Spring Security.

## Regla de sincronización y salida

Cuando cambie una ruta backend, revisar [contrato HTTP](../../../adoptr-back/docs/arquitectura/api.md), modelos TS, permisos, errores y prueba de integración en el mismo cambio. No consumir como funcional un stub ni un service interno; documentar por separado **observado**, **bloqueado** y **propuesto**. Para desplegar login se requiere cerrar los bloqueos del backend (validación de identidad y rotación del secreto), comprobar que el JWT Adoptr nunca se serializa al navegador y que el ID token Google solo se usa en el callback y envío a la server action, sin aparecer en logs. Configurar `API_URL` según dónde corre el servidor Next: `localhost` solo sirve si la API está en el mismo host. En contenedor usar el hostname del backend; no poner tokens ni secretos en `NEXT_PUBLIC_*`.

## Pruebas de integración a acordar con el equipo

1. Con origen y Client ID de prueba autorizados, cubrir carga diferida del SDK, aparición del botón, login y redirección a `/profile`; contemplar política de cookies para HTTP de desarrollo y HTTPS de despliegue.
2. Verificar respuestas ante ID token inválido, JWT vencido y usuario sin perfil; no exponer credenciales en logs ni mostrar datos protegidos por sola presencia de cookie.
3. Validar JSON del backend frente a los modelos TS con tests de contrato. Hasta corregir el principal en backend, no asumir que GET `/profile` funciona.
