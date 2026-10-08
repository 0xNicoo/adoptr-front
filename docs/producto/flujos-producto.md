# Flujos de producto — frontend

Hipótesis de experiencia para acordar con producto y backend, no pantallas implementadas ni requisitos aprobados. Para vocabulario y reglas de negocio ver [dominio backend](../../../adoptr-back/docs/producto/dominio-y-alcance.md); para integración técnica ver [integración](../arquitectura/integracion.md).

## Inventario de experiencia observada (no MVP validado)

| Recorrido | Estado de la UI y API | No prometer todavía |
| --- | --- | --- |
| `/` | Pantalla de inicio de sesión con botón Google; el callback llama a `loginAction`, intenta guardar cookie y redirige a `/profile`. Logout desde el menú borra la cookie y vuelve a `/`. | No es un catálogo. El SDK se carga de forma asíncrona y el botón puede no aparecer; el error de login queda solo en consola. Login backend aún tiene bloqueos de confianza ([integración](../arquitectura/integracion.md)). |
| `/profile` | Ruta existente; el proxy redirige a `/` si falta cookie. La página solo muestra `ProfilePage`, sin datos ni formulario. | No hay alta/lectura de perfil en UI; presencia de cookie no equivale a sesión válida. GET backend falla con el JWT actual y POST es stub. |
| Navegación | «Adoptar», «Servicios» y «Perdidas» son textos sin acción; el menú desplegable enlaza `/mi-perfil`, `/adopcion/favoritas` y `/chat/publicaciones`, rutas inexistentes en `src/app`. El login/logout del menú no está disponible en mobile. | Enlaces visibles no significan flujos funcionales. Retirar/ocultar o sustituir por destinos reales cuando se acuerden; no simular acciones de persistencia. |
| Adopción | No hay rutas o actions para catálogo, detalle, publicación, solicitud, favoritos o chat, ni endpoints backend que las sostengan. | No hay fichas, filtros, solicitudes ni gestión disponibles para usuarios. |

Inventario obtenido de `src/app/`, `src/actions/auth.ts`, `src/proxy.ts` y [API backend](../../../adoptr-back/docs/arquitectura/api.md). Es una observación estática, no prueba de que el login funcione en todos los entornos. Actualizar la tabla al entregar un recorrido; distinguir siempre UI visible, endpoint, persistencia y pruebas.

## Hipótesis de experiencia para consensuar

1. **Exploración:** ¿el catálogo de mascotas es público? ¿Qué filtros y datos son útiles sin comprometer la privacidad del responsable?
2. **Detalle:** ¿qué información e imágenes permiten decidir si iniciar contacto? ¿Cómo se muestra el estado de la publicación?
3. **Participación:** ¿en qué momento se requiere login y perfil? ¿Cómo se presenta y confirma una solicitud de adopción? ¿Qué ocurre si ya fue adoptada?
4. **Responsable:** ¿cómo publica, edita, pausa, recibe y gestiona solicitudes? ¿Qué feedback obtiene cada parte?
5. **Alcance:** ¿perdidas, servicios, favoritos y chat forman parte del MVP o son iniciativas posteriores? No enlazar acciones simuladas como si fueran funcionales.

## Criterios de experiencia antes de lanzar un flujo (propuesta)

Acordar las respuestas con producto/diseño/backend antes de diseñar rutas o formularios definitivos; registrar **decisión, responsable/fecha, audiencia, datos visibles, casos límite y aceptación** en el [dominio compartido](../../../adoptr-back/docs/producto/dominio-y-alcance.md). En particular: ¿la home es pública o de login?, ¿cuándo se exige login/perfil?, ¿qué pantalla se abre después de login/logout?, ¿qué muestra cada parte de una solicitud?, ¿cómo se avisa de publicación cerrada o sesión vencida? Nada de esto se deduce de los componentes actuales.

Para cada recorrido acordado exigir: ruta y endpoint/persistencia reales, permisos backend, datos personales mínimos; estados carga, vacío, error y confirmación; tratamiento de 401/expiración; teclado/foco/labels/contraste y layout móvil; pruebas de navegación y contrato. En el estado actual, el menú de perfil se abre con un `div` clicable sin controles de teclado, el callback Google puede faltar por orden de carga y registra la credencial en consola: son deudas a corregir, no patrones a replicar. Las prioridades técnicas están en [lineamientos](../arquitectura/lineamientos.md).
