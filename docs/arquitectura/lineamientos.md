# Arquitectura y lineamientos — frontend

Descripción de la estructura y criterios para evolucionarla. Mantener aquí las responsabilidades de los componentes; actualizar [integración](integracion.md) cuando cambie el contrato HTTP y acordar recorridos en [flujos de producto](../producto/flujos-producto.md).

## Componentes y responsabilidades

- Stack: Next.js App Router, React, TypeScript y Tailwind. `src/app` define rutas/layout/navbar y estilos; `src/actions` contiene server actions; `src/lib/api/calls` encapsula requests; `src/lib/api/models` tipa respuestas; `src/lib/auth` gestiona la cookie HttpOnly en servidor; `src/proxy.ts` controla navegación según presencia de sesión.
- Renderizado: la navbar (en el layout) lee la cookie de sesión en el servidor para mostrar «Ingresar» o el menú de usuario, por eso todas las rutas son dinámicas (se renderizan por pedido en vez de pre-generarse en el build). Decisión aceptada a cambio de que la navbar salga correcta sin parpadeo; si una página pública necesitara volver a ser estática, la sesión tendría que resolverse del lado cliente.
- Login observado: Google Identity Services entrega un ID token al componente cliente → server action → backend `/auth/oauth` → JWT Adoptr guardado en cookie HttpOnly. **Contradicción actual:** `loginAction` también devuelve el objeto `Auth` completo (incluido JWT) al componente cliente; la cookie HttpOnly no evita esa exposición. Corregir el retorno para entregar solo datos aptos para cliente antes de afirmar que el JWT permanece en servidor. El wrapper `apiRequest` agrega Bearer desde servidor si existe cookie; el proxy **no** valida el JWT: permisos y datos deben validarse en backend.
- Separar en adelante rutas públicas (si producto acuerda un catálogo público) de acciones autenticadas. El servidor Next habla con la API; el navegador no debe recibir el JWT Adoptr ni depender de hostnames internos de infraestructura.

## Criterios de diseño

- Ubicar componentes por feature cerca de sus rutas y abstraer solo los reutilizables. Mantener acceso a API centralizado en `src/lib/api`, sin duplicarlo en componentes cliente.
- Tipar modelos según JSON real, validar inputs/errores en los bordes, definir URL de API por entorno **solo del lado servidor** y cache/revalidación acorde a datos públicos o privados. Hoy `apiRequest` exige `API_URL` solo de servidor, usa tipos `any` y no explicita timeout ni política de caché; solo auth lo llama. No usar caché compartida para respuestas privadas al incorporar lecturas autenticadas.
- Tratar `src/proxy.ts` como ayuda de navegación, no como autorización: hoy comprueba presencia de cookie **solo para la ruta exacta** `/profile` y redirige a `/login` sin conservar destino. Contemplar expiración/401 y redirección sin perder el destino; definir estrategia de cookies y duración con backend. `secure: true` y ausencia de TTL explícito necesitan verificación en HTTP local/HTTPS de producción; no relajar seguridad de producción para desarrollo.
- Implementar rutas según casos de uso y contratos acordados; no inventar navegación o persistencia para funcionalidades sin endpoint.

## Ejecución compartida y contenedores (propuesta)

- Compartir una opción Docker Compose con backend y PostgreSQL para desarrollo/CI puede reducir diferencias de versiones y configuración; mantener también instrucciones nativas. La definición de Compose debe tener un único dueño acordado con backend, no dos copias divergentes.
- Contenedor Next.js con versión de Node compatible, dependencias reproducibles (`npm ci`) y URL de API **solo de servidor** parametrizada: dentro de Compose el server action/fetch debe usar el nombre de servicio del backend (`http://backend:8081` si así se lo llama), no `localhost:8081` (que apuntaría al propio contenedor). El navegador sigue entrando por el origen publicado, por ejemplo `http://localhost:3000`.
- Google Identity Services exige autorizar el origen del navegador, no el hostname Docker interno. `NEXT_PUBLIC_GOOGLE_CLIENT_ID` es público y puede quedar integrado en el build del cliente; acordar cómo se construye para cada entorno. Revisar cookie `secure` para HTTP de desarrollo/HTTPS de producción y el origen permitido en CORS. No versionar `.env.local`, JWT ni secretos en imágenes o Compose.

## Experiencia y sistema visual

- Paleta, tipografía, componentes base, reglas de ilustración y accesibilidad visual: ver [sistema visual](sistema-visual.md), que es la referencia de estilo para pantallas nuevas y tokens de `globals.css`.
- Mantener identidad existente (azul/naranja, Genty Demo para marca, Geist para interfaz) y consolidar tokens de `globals.css` en componentes reutilizables: botón, campo, tarjeta de mascota, badge de estado, aviso/error y modal. Revisar contraste en tema claro/oscuro, estados focus/hover/disabled y responsive.
- MVP de navegación **a definir con producto**: catálogo de mascotas con filtros (ubicación y atributos solo si están soportados), detalle con fotos y datos esenciales, CTA de consulta/adopción, perfil/alta de publicación; añadir perdidas/servicios, favoritos y chat solo con contrato real. No inventar información de mascota ni simular acciones persistidas.
- Navegación semántica: links para destinos existentes, botones reales para menús, foco y cierre con teclado, etiquetas accesibles; navbar mobile también debe ofrecer login/logout cuando corresponda. Formulario Google con carga controlada del SDK y estados de error/espera, sin log de credenciales.
- Cada pantalla debe prever loading, vacío, error, sesión expirada y éxito; accesibilidad en imágenes (alt), formularios (labels/errores) y contraste. Verificar en ancho móvil y escritorio. Usar textos en español consistentes.

## Prioridades técnicas a resolver

1. Robustecer carga del SDK Google, validar cookie/sesión y manejo de errores; alinear navegación de perfil con rutas reales y permisos del backend.
2. Construir las vistas de perfil sobre los endpoints que ya existen (`GET`/`POST /profile`, catálogo de provincias y localidades) y los tipos alineados con ellos.
3. Tras acordar el contrato con backend y producto, incorporar listado/detalle y luego publicación/solicitud de adopción con estados de UI completos; dejar fuera enlaces a flujos inexistentes.
4. Corregir lint, auditar/actualizar dependencias, añadir pruebas de integración/e2e y ejecutar `lint`, TypeScript y build en CI.

## Riesgos actuales y criterios de aceptación

1. **Identidad (antes de confiar en la sesión):** la página de login ya no registra la respuesta de Google y `loginAction` ya no devuelve el JWT al cliente; mantenerlo así en cambios futuros y cubrirlo con pruebas automatizadas de login, error, logout y expiración cuando haya infraestructura de tests. El backend todavía no valida issuer/audience/proveedor y mantiene un secreto JWT conocido: ver [API backend](../../../adoptr-back/docs/arquitectura/api.md); no declarar login listo para producción.
2. **Integración:** `apiRequest` lanza `ApiError` con `status` y `code` (o `UNKNOWN_ERROR` si el cuerpo no es el `{code, message}` del back) y no registra el cuerpo del error. Pendiente: no falla por falta de token aunque se invoque con `requiresAuth=true` (aún no hay tales llamadas desde UI), falta la estrategia para 401 (`UNAUTHENTICATED`) y probar casos de red/timeout. La base URL se configura con `API_URL` solo de servidor; definirla según la topología del entorno.
3. **Contrato tipado:** los modelos de `src/lib/api/models/` siguen el contrato de [API backend](../../../adoptr-back/docs/arquitectura/api.md): ids numéricos, fechas como texto ISO, `User.profile` nullable, `Profile` como unión discriminada por `profileType` y `Locality` con `displayName`. Al cambiar el contrato, actualizar los tipos en el mismo cambio y probar contra JSON real; no copiar tipos aspiracionales a nuevas pantallas.
4. **Calidad y alcance:** hoy solo existen `/` (landing), `/login` y `/profile` (placeholder), no hay tests automatizados configurados en `package.json` para flujos, y la navegación contiene enlaces a rutas inexistentes. Una feature se acepta con ruta/contrato/persistencia reales o mock temporal **visible y rotulado**, autorización backend, estados, accesibilidad móvil y pruebas. Ver [flujos](../producto/flujos-producto.md) para decisiones pendientes. Docker/CI listados arriba son propuestas, no servicios existentes.

Mantener la lista de prioridades corta y orientada a decisiones del código, no a avances de un entorno particular.
