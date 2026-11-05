# Flujos de producto — frontend

Hipótesis de experiencia para acordar con producto y backend, no pantallas implementadas ni requisitos aprobados. Para vocabulario y reglas de negocio ver [dominio backend](../../../adoptr-back/docs/producto/dominio-y-alcance.md); para integración técnica ver [integración](../arquitectura/integracion.md).

## Inventario de experiencia observada (no MVP validado)

| Recorrido | Estado de la UI y API | No prometer todavía |
| --- | --- | --- |
| `/` | Landing pública con el estilo del [sistema visual](../arquitectura/sistema-visual.md): presentación, «¿Cómo adoptar?» y secciones «Próximamente» (perdidos y encontrados, servicios). Los botones «Ver mascotas en adopción» y «Publicar una mascota» están deshabilitados con «Próximamente». Logout desde el menú vuelve acá. | No es un catálogo. Los pasos de «¿Cómo adoptar?» describen funciones que todavía no existen (filtros, guardar publicaciones, chat). |
| `/login` | Pantalla de inicio de sesión con botón Google; el callback llama a `loginAction`, intenta guardar cookie y redirige a `/profile`. | El SDK se carga de forma asíncrona y el botón puede no aparecer; el error de login queda solo en consola. Login backend aún tiene bloqueos de confianza ([integración](../arquitectura/integracion.md)). |
| `/profile` | Ruta existente; el proxy redirige a `/login` si falta cookie. La página solo muestra `ProfilePage`, sin datos ni formulario. | No hay alta/lectura de perfil en UI; presencia de cookie no equivale a sesión válida. GET backend ya responde (404 `PROFILE_NOT_FOUND` si no hay perfil) pero la UI no lo consume; POST es stub. |
| Navegación | Navbar del sistema visual (`components/navbar/`). «Adoptar» y «Publicar» llevan a `/`; «Cómo funciona», a `/#como`. Sin cookie muestra «Ingresar» (`/login`); con cookie, el menú de usuario con «Mi perfil» (`/profile`), «Favoritas» y «Chats» deshabilitados con «Próximamente», y «Salir». En mobile, el menú desplegable incluye «Ingresar» o «Mi perfil» y «Salir». | La navbar decide por la presencia de la cookie: una cookie vencida todavía muestra el menú de usuario. Favoritas y chat no existen. |
| Adopción | No hay rutas o actions para catálogo, detalle, publicación, solicitud, favoritos o chat, ni endpoints backend que las sostengan. | No hay fichas, filtros, solicitudes ni gestión disponibles para usuarios. |

Inventario obtenido de `src/app/`, `src/actions/auth.ts`, `src/proxy.ts` y [API backend](../../../adoptr-back/docs/arquitectura/api.md). Es una observación estática, no prueba de que el login funcione en todos los entornos. Actualizar la tabla al entregar un recorrido; distinguir siempre UI visible, endpoint, persistencia y pruebas.

Decidido por producto (Dolores, 2026-11-05): la home `/` es una landing pública y el inicio de sesión vive en `/login`. Mientras no existan catálogo ni alta de publicación, sus botones se muestran deshabilitados con «Próximamente», y «Adoptar» y «Publicar» de la navegación llevan a la landing.

## Hipótesis de experiencia para consensuar

1. **Exploración:** ¿el catálogo de mascotas es público? ¿Qué filtros y datos son útiles sin comprometer la privacidad del responsable?
2. **Detalle:** ¿qué información e imágenes permiten decidir si iniciar contacto? ¿Cómo se muestra el estado de la publicación?
3. **Participación:** ¿en qué momento se requiere login y perfil? ¿Cómo se presenta y confirma una solicitud de adopción? ¿Qué ocurre si ya fue adoptada?
4. **Responsable:** ¿cómo publica, edita, pausa, recibe y gestiona solicitudes? ¿Qué feedback obtiene cada parte?
5. **Alcance:** ¿perdidas, servicios, favoritos y chat forman parte del MVP o son iniciativas posteriores? No enlazar acciones simuladas como si fueran funcionales.

## Criterios de experiencia antes de lanzar un flujo (propuesta)

Acordar las respuestas con producto/diseño/backend antes de diseñar rutas o formularios definitivos; registrar **decisión, responsable/fecha, audiencia, datos visibles, casos límite y aceptación** en el [dominio compartido](../../../adoptr-back/docs/producto/dominio-y-alcance.md). En particular: ¿cuándo se exige login/perfil?, ¿qué pantalla se abre después de login/logout?, ¿qué muestra cada parte de una solicitud?, ¿cómo se avisa de publicación cerrada o sesión vencida? Nada de esto se deduce de los componentes actuales.

Para cada recorrido acordado exigir: ruta y endpoint/persistencia reales, permisos backend, datos personales mínimos; estados carga, vacío, error y confirmación; tratamiento de 401/expiración; teclado/foco/labels/contraste y layout móvil; pruebas de navegación y contrato. En el estado actual, el callback Google puede faltar por orden de carga y registra la credencial en consola: son deudas a corregir, no patrones a replicar. Las prioridades técnicas están en [lineamientos](../arquitectura/lineamientos.md).
