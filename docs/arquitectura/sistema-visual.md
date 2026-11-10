# Sistema visual — frontend

Guía de estilo de Adoptr: paleta, tipografía, componentes base, ilustraciones y accesibilidad. Es la referencia para construir pantallas y para los tokens de `src/app/globals.css`. Los recorridos y reglas de producto **no** se definen acá: ver [flujos](../producto/flujos-producto.md) y [lineamientos](lineamientos.md).

**Estado:** propuesta validada visualmente con un prototipo (guía, inicio, catálogo, ficha y paso 2 de publicación). Los tokens de color, forma y fuentes ya están en `src/app/globals.css`; los componentes base y las pantallas todavía no los usan. Las pantallas del prototipo muestran ideas de UX que siguen siendo decisiones abiertas de producto; lo que vale de ellas es el estilo.

## Dirección

Retro años 50/60 con colores vivos («chillones»): como un afiche o una caricatura impresa de esa época.

- Fondo **papel crema**, nunca blanco puro.
- Texto, contornos y sombras en **azul tinta**, nunca negro.
- Colores **planos y saturados**, pocos a la vez. Sin degradés.
- **Contornos gruesos** y **sombras duras desplazadas** (sin desenfoque), como la del logo.
- Formas redondeadas: botones tipo píldora, tarjetas con esquinas amplias.
- Recursos de época, usados con medida: trama de puntos (*halftone*), *starbursts* para destacar, etiquetas levemente giradas.

## Paleta

Azul y naranja son los colores de la marca y mandan. Los acentos se usan poco: badges, ilustraciones y fondos de tarjetas.

| Token propuesto | Color | Hex | Uso | Texto encima |
| --- | --- | --- | --- | --- |
| `primary` | Azul Adoptr | `#1C3EB2` | Botón primario, títulos, links, fondo de la navbar | Blanco (8,8:1) |
| `cta` | Naranja Adoptr | `#FF823B` | Acción principal de cada pantalla | **Tinta** (6,6:1). Nunca blanco (2,5:1) |
| `cta-hover` | Naranja oscuro | `#DB6826` | Hover del naranja | Tinta |
| `ink` | Tinta | `#0B1956` | Texto, contornos, sombras y pie | Crema |
| `ink-soft` | Tinta suave | `#4A5280` | Texto secundario, fechas, ayudas, «no» | Sobre papel: 6,8:1 |
| `paper` | Papel | `#FFF4E2` | Fondo general | Tinta |
| `surface` | Papel claro | `#FFFDF7` | Tarjetas, paneles, campos de lectura | Tinta |
| `positive` | Verde manzana | `#6CC24A` | «En adopción», salud en «sí», pasos completos, éxito | Tinta (7,4:1) |
| `positive-soft` | Verde suave | `#E3F5D9` | Fondo de chips positivos | Tinta |
| `accent-teal` | Turquesa | `#2EC4B6` | Decoración: fondos de tarjeta, ilustraciones, etiquetas | Tinta (7,5:1) |
| `accent-mustard` | Mostaza | `#FFC43D` | Destacados, *starbursts*, «Próximamente» | Tinta |
| `danger` | Cereza | `#C8303C` | «Adoptado», errores | Blanco (5,5:1) |
| `danger-soft` | Cereza suave | `#FFF1F1` | Fondo de campo con error | Tinta |
| `disabled` | Papel gris | `#EDE4D3` | Fondo de controles deshabilitados | Tinta suave |

Reglas:

- **El naranja no lleva texto blanco**, ni se usa como color de texto sobre papel (no llega al contraste mínimo).
- **El naranja es escaso:** una acción principal por pantalla o por bloque. En listas repetidas (tarjetas del catálogo) los botones van en `surface` con contorno.
- **Verde para lo positivo, cereza para lo negativo o cerrado.** El turquesa es solo decorativo, para no competir con el verde.
- Los colores que tienen que distinguirse (estado, sí/no) también difieren en forma o texto, no solo en tono.
- En `globals.css` cada token es `--color-<nombre>` (clases `bg-<nombre>`, `text-<nombre>`, `border-<nombre>`). Los nombres viejos por pantalla (`primary-blue`, `sectionB`, etc.) ya no existen: no reintroducirlos.

## Tipografía

| Rol | Fuente | Licencia | Uso |
| --- | --- | --- | --- |
| Logo | Genty Demo | **Pendiente de verificar** | Solo la marca. Las fuentes «Demo» suelen ser de uso personal: confirmar licencia comercial antes de un deploy público. |
| Títulos | Lilita One | OFL | Títulos de pantalla y sección, nombres de mascotas. Nunca en párrafos. |
| Interfaz | Geist | OFL | Todo el resto: texto, botones, campos, etiquetas. |

Alternativas evaluadas para títulos (todas OFL), por si se quiere cambiar: Righteous (geométrica, la más años 60), Titan One (inflada) y Bowlby One (de afiche, más seria). Cambiarla debe ser modificar una sola variable de fuente.

Escala:

| Estilo | Fuente | Tamaño / peso |
| --- | --- | --- |
| Título de pantalla | Lilita One | 54–68 px |
| Título de sección | Lilita One | 36–48 px |
| Nombre en tarjeta | Lilita One | 28–30 px |
| Subtítulo | Geist | 22 px / 700 |
| Texto | Geist | 17 px / 400, interlineado 1,55 |
| Ayuda | Geist | 14–15 px / 400, color `ink-soft` |
| Etiqueta | Geist | 13 px / 600, mayúsculas, espaciado 0,08 em |

Quitar el `font-family: Arial` que hoy fuerza `globals.css` en `body`.

## Forma

| Elemento | Valor |
| --- | --- |
| Contorno de tarjetas, botones y campos | 3 px `ink` |
| Contorno de chips | 2–2,5 px |
| Sombra dura | `4px 4px 0 ink` en botones; `6px 6px 0` en tarjetas; `8px 8px 0` en paneles grandes |
| Radio | Botones y chips: píldora (999 px). Tarjetas: 22 px. Campos: 14 px |
| Trama de puntos | `radial-gradient(rgba(11,25,86,.16) 1.3px, transparent 1.6px)` con `background-size: 14px 14px` |

## Componentes base

**Botones** (alto mínimo 48 px, 44 px en barras compactas):

| Variante | Fondo | Texto | Cuándo |
| --- | --- | --- | --- |
| CTA | `cta` | `ink` | La acción principal: «Buscar», «Quiero adoptar» |
| Primario | `primary` | blanco | Avanzar en un flujo: «Siguiente», «Editar» |
| Secundario | `surface` | `ink` | Acciones de apoyo y botones repetidos en listas |
| Deshabilitado | `disabled` con contorno punteado `ink-soft` | `ink-soft` | Sin sombra |

Estados: al presionar el botón se desplaza 4 px y pierde la sombra; el foco se marca con `outline` de 3 px `accent-teal` separado 4 px. Los botones de solo ícono llevan `aria-label`.

Sobre fondos oscuros (`primary` o `ink`), el contorno y la sombra tinta casi no se ven (1,8:1 sobre azul): usar `tone="dark"`, que los pasa a papel. Tamaño `size="sm"` (alto 44 px) para barras compactas como la navbar.

**Badges de estado:** píldora con contorno. «En adopción» en `positive` y «Adoptado» en `danger` cuando van sueltos; sobre una foto, fondo `surface` para que se lean. «Próximamente» en `accent-mustard`, rectangular y levemente girada.

**Datos de salud (sí/no):** el «sí» va en chip `positive-soft` con contorno sólido y tilde; el «no» va con contorno punteado `ink-soft`, cruz y texto explícito («Sin castrar»). No usar un tilde gris para «no»: se confunde con «deshabilitado». En formularios, cada dato es un par de botones Sí/No. En la tarjeta de mascota van los mismos chips en tamaño chico (`size="xs"`).

**Campos:** etiqueta siempre visible arriba (no solo *placeholder*), contorno 3 px, fondo blanco. Error: contorno y texto `danger`, fondo `danger-soft` y mensaje asociado con `aria-describedby`.

**Selectores:** `src/app/components/ui/select.tsx` centraliza los desplegables con `Listbox` de Headless UI (la dependencia ya usada por la navbar). Se usa en provincia, filtros de tamaño/sexo/edad y años/meses del alta. El clic sobre texto o flecha solo abre la lista, anclada fuera del campo; elegir una opción o confirmar con Enter cambia el valor. Escape cierra sin confirmar el cambio; admite flechas y búsqueda por teclado. Conserva etiqueta asociada, foco visible y atributos de error. Los formularios contemplan el botón con `aria-haspopup="listbox"` al enfocar el primer campo inválido. No cambia los valores ni los contratos de la API.

**Tarjeta de mascota** (diseño v2, Dolores, 2026-11-10): ancho mínimo 340 px (la grilla pone tantas columnas como entren: en el catálogo, de hasta 1560 px, son 4 desde pantallas de ~1480 px). Foto arriba en **4:3** (mientras carga o si falta, fondo de color con trama) con el badge de estado: «En adopción» en `surface`, «Adoptada/o» en `danger`. Nombre en Lilita One y, a la derecha, el sexo como ícono en un círculo (♂ en `primary` con ícono blanco, ♀ en `cta` con ícono tinta, «?» en `surface`); debajo, tamaño y edad («Pequeño · 3 años y 3 meses»; los gatos, solo la edad) y la ubicación («Florencio Varela, Buenos Aires»), sin especie. Salud en chips chicos en un solo renglón y un único botón secundario: «Conocelo/Conocela», o «Ver su historia» si fue adoptada. Las fotos de adopción son **verticales, 3:4**: se recortan al elegirlas en el alta (`photo-crop-dialog.tsx`, con `react-easy-crop`) y el back recorta al centro cualquier otra proporción. La tarjeta es apaisada (4:3) y muestra la franja central de la foto (`object-cover`); el detalle la muestra entera en un visor 3:4 (con sus miniaturas también en 3:4), en una columna de 5/12 del ancho para que no quede demasiado alta. Pendientes del diseño, para cuando existan: el corazón de favoritos arriba a la derecha y, para quien publicó, el badge «Tu publicación» con «Editar» y «Fue adoptada» en lugar de «Conocelo».

**Adoptadas:** la foto o la ilustración va en gris (`PetArt` con `muted`: fondo `disabled`, `grayscale` y opacidad) en tarjetas y detalle.

**Acciones de quien publicó:** en el detalle, el estado va como pastilla bajo el nombre («En adopción» en `positive-soft` con punto verde; «Adoptada/o» en `danger` con punto hueco blanco) y la acción principal arriba a la derecha como botón primario. En las tarjetas de «Mi perfil», un botón redondo «⋯» sobre la foto abre el menú de opciones (`owner-card-menu.tsx`). La confirmación de cambio de estado es un diálogo con franja de color y trama arriba (`positive` con corazón para «adoptada», `accent-mustard` con flecha para volver a adopción) y el botón de confirmar en `cta`.

**Aviso (toast):** abajo al centro, píldora `ink` con texto en `surface`, sombra dura `cta` y ✕; se va solo a los 6 s (`toast.tsx`, `useToast()`).

**Navbar:** fondo `primary` (azul Adoptr) con línea inferior `ink` de 4 px. Logo en `surface` (blanco) con «tr» naranja y sombra dura tinta; links, íconos y botón del menú mobile en `surface` (8,7:1). Subrayado de hover en `cta` (3,6:1 sobre el azul). «Ingresar» como botón `cta` con `tone="dark"`. Nada en tinta sobre el azul: no llega a 3:1.

**Stepper:** pasos numerados en círculos; completo en `positive` con tilde, actual en `cta`, pendientes con contorno punteado `ink-soft`.

## Ilustraciones e íconos

- **Carpeta propia:** `public/illustrations/{perros,gatos,decoracion}` con un `LICENCIAS.md` que registre, por archivo, origen, autor y licencia. No se suma ninguna imagen sin esa línea.
- **Un solo estilo:** contorno `ink` de 4 px, rellenos planos con colores de la paleta, sin degradés. La textura la da la trama de puntos.
- **No reutilizar** imágenes del front viejo sin verificar su licencia. En particular, `Snoopy.png` (personaje con copyright), los archivos con nombre tipo Freepik (`5737612.png`) y los banners de marcas de terceros quedan descartados.
- **Fotos reales:** solo las que suben los usuarios. Datos de prueba con fotos propias.
- **Íconos:** un solo set, de trazo redondeado de 2,2 px: **Phosphor** (`@phosphor-icons/react`, MIT, peso `bold`; en server components se importa de `@phosphor-icons/react/dist/ssr`). Los íconos nuevos van con Phosphor; los de Heroicons que quedan (navbar, localidad, flechas, chips de salud) se migran en un cambio aparte. Sin emojis. Decorativos con `aria-hidden="true"`; los que transmiten información, con `aria-label`.

## Accesibilidad

- Contraste mínimo 4,5:1 para texto (3:1 solo para texto de 24 px o más); los pares de la tabla de paleta ya están calculados.
- Áreas táctiles de 44 px como mínimo.
- Controles reales (`button`, `a href`, `input` con `label`), foco visible y orden de tabulación lógico.
- Cada pantalla contempla carga, vacío, error y sesión vencida (ver [lineamientos](lineamientos.md)).
- Verificar en ancho móvil: las grillas pasan a una columna y la navbar se reacomoda sin perder «Ingresar».

## Pendientes

1. Confirmar la licencia comercial de Genty Demo o reemplazar el logo por uno con licencia clara.
2. Producir las ilustraciones definitivas de perros y gatos con estas reglas (las del prototipo son provisorias).
3. Componentes base: en `src/app/components/ui/` ya existen `Button`, `Badge`, las piezas de campo (`form-field.tsx`), la tarjeta de mascota (`pet-card.tsx`, con `pet-art.tsx` para el bloque de color con ilustración `health-chips.tsx` para la salud y `sex-icon.tsx` para el sexo). El stepper existe como `stepper.tsx` (completo en verde con tilde, actual en naranja, pendientes punteados) y lo usa el alta de adopción; el alta de perfil todavía tiene su propia versión, a migrar en un cambio aparte.
4. Modo oscuro: la paleta es solo clara. Se retiró el ajuste automático por `prefers-color-scheme`; diseñar una variante oscura si producto la pide.
