# Referencia de diseño

> Extraído el 2026-10-04 de los prototipos de Stitch ("Botanical Precision"). Los prototipos no se versionan en el repo.
> **Solo valen los colores, la tipografía y la distribución.** El contenido y los componentes de los prototipos **no son correctos** y no se usan como especificación funcional ni de datos.
> Hoy el front no aplica nada de esto: usa `system-ui`, fondo `#f5f5f5`, texto `#222` y grises sueltos, sin tokens de color (ver `docs/context.md`).

## Decisiones

| Tema   | Decisión                                                                                                                                    | Motivo                                                                                                                                                                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Paleta | Los tokens Material 3 de abajo (front-matter del `DESIGN.md` de Stitch, idénticos al `tailwind.config` de todos los prototipos)             | Es la paleta que realmente pintan los prototipos. Cada fondo tiene su color de texto emparejado (`on-*`), así que el contraste viene resuelto. Se traslada tal cual a custom properties. Los hex sueltos del texto del `DESIGN.md` (`#F9F8F5`, `#6C8A74`, `#D4A373`…) **no** se adoptan |
| Iconos | Material Symbols Outlined, empaquetados como SVG (no como fuente web), detrás de un componente `<Icon name=… />` que sustituye a `iconsMap` | Es la familia de los prototipos y cubre bien el dominio botánico. Como SVG se evita descargar la fuente entera y el parpadeo de texto. El paquete concreto se elige en el plan de la spec                                                                                               |
| Emojis | Se eliminan de la UI                                                                                                                        | Decisión del propietario                                                                                                                                                                                                                                                                |

## Paleta (tokens)

| Token                       | Valor     | Token                        | Valor     |
| --------------------------- | --------- | ---------------------------- | --------- |
| `primary`                   | `#002718` | `on-primary`                 | `#ffffff` |
| `primary-container`         | `#133e2b` | `on-primary-container`       | `#7da990` |
| `primary-fixed`             | `#bfedd2` | `primary-fixed-dim`          | `#a3d1b6` |
| `on-primary-fixed`          | `#002113` | `on-primary-fixed-variant`   | `#254f3a` |
| `inverse-primary`           | `#a3d1b6` | `surface-tint`               | `#3d6751` |
| `secondary`                 | `#486551` | `on-secondary`               | `#ffffff` |
| `secondary-container`       | `#caebd1` | `on-secondary-container`     | `#4e6b56` |
| `secondary-fixed`           | `#caebd1` | `secondary-fixed-dim`        | `#aeceb6` |
| `on-secondary-fixed`        | `#042011` | `on-secondary-fixed-variant` | `#314d3a` |
| `tertiary`                  | `#341b00` | `on-tertiary`                | `#ffffff` |
| `tertiary-container`        | `#502f09` | `on-tertiary-container`      | `#c69667` |
| `tertiary-fixed`            | `#ffdcbd` | `tertiary-fixed-dim`         | `#f0bd8b` |
| `on-tertiary-fixed`         | `#2c1600` | `on-tertiary-fixed-variant`  | `#623f18` |
| `error`                     | `#ba1a1a` | `on-error`                   | `#ffffff` |
| `error-container`           | `#ffdad6` | `on-error-container`         | `#93000a` |
| `background`                | `#f3fbf6` | `on-background`              | `#151d1a` |
| `surface`                   | `#f3fbf6` | `on-surface`                 | `#151d1a` |
| `surface-dim`               | `#d3dcd7` | `surface-bright`             | `#f3fbf6` |
| `surface-container-lowest`  | `#ffffff` | `surface-container-low`      | `#edf6f1` |
| `surface-container`         | `#e7f0eb` | `surface-container-high`     | `#e2eae5` |
| `surface-container-highest` | `#dce4e0` | `surface-variant`            | `#dce4e0` |
| `on-surface-variant`        | `#414943` | `outline`                    | `#717973` |
| `outline-variant`           | `#c1c8c1` | `inverse-surface`            | `#2a322f` |
| `inverse-on-surface`        | `#eaf3ee` |                              |           |

Equivalencias para quien lea el texto original de Stitch: el verde "Deep Forest Emerald" (`#133E2B`) es `primary-container`; el acento ocre se cubre con `tertiary-fixed-dim` (`#f0bd8b`).

Usos de referencia: `primary-container` para acciones principales, estado activo de navegación, toggles activos, página activa de la paginación y relleno de sliders; `secondary-container` para fondos suaves y filtros activos; `tertiary-fixed-dim` como acento puntual (avisos, siembra, fotoperiodo).

## Tipografía

| Estilo                | Familia                 | Tamaño / interlineado                 | Peso |
| --------------------- | ----------------------- | ------------------------------------- | ---- |
| `headline-xl`         | Newsreader              | 2.5rem / 3rem (móvil 2rem / 2.5rem)   | 500  |
| `headline-lg`         | Newsreader              | 1.75rem / 2.25rem                     | 500  |
| `headline-md`         | Newsreader              | 1.375rem / 1.75rem                    | 600  |
| `headline-sm`         | Newsreader              | 1.125rem / 1.5rem                     | 600  |
| `taxonomy-scientific` | Newsreader, **cursiva** | 0.875rem / 1.25rem, tracking 0.015em  | 400  |
| `body-lg`             | Manrope                 | 1rem / 1.5rem                         | 400  |
| `body-md`             | Manrope                 | 0.875rem / 1.375rem                   | 400  |
| `body-sm`             | Manrope                 | 0.75rem / 1.125rem                    | 400  |
| `label-lg`            | Manrope                 | 0.875rem / 1.25rem                    | 600  |
| `label-md`            | Manrope                 | 0.75rem / 1rem, tracking 0.025em      | 600  |
| `label-sm`            | Manrope                 | 0.6875rem / 0.875rem, tracking 0.05em | 700  |

Newsreader para titulares, nombres comunes destacados y nombres científicos (en cursiva). Manrope para toda la interfaz, etiquetas, meses, métricas e inputs.

## Forma, espaciado y elevación

- **Radios**: `sm` 0.125rem · `DEFAULT` 0.25rem (inputs, chips de mes, thumbs de slider) · `md` 0.375rem · `lg` 0.5rem (tarjetas, media, menús, botones) · `xl` 0.75rem (paneles de filtros, diálogos) · `full` 9999px (solo badges, etiquetas y toggles tipo pill).
- **Espaciado**: ritmo base de 8px. `space-xs` 0.25rem (solo huecos entre badges), `space-sm` 0.5rem, `space-md` 1rem, `space-lg` 1.5rem, `space-xl` 2.5rem. Gutter 1.25rem (escritorio 1.5rem). Margen lateral 1rem / tablet 2rem / escritorio 3rem.
- **Elevación** con planos tonales y sombras tintadas en verde, no con bordes gruesos:
  - Nivel 1 (tarjetas): `0 1px 3px rgba(19,62,43,0.04), 0 6px 16px rgba(19,62,43,0.03)`; hover `0 8px 24px rgba(19,62,43,0.08)`.
  - Nivel 2 (drawers, menús, modales): `0 12px 32px rgba(19,62,43,0.12)`.
  - Bordes finos de 1px con `outline-variant`.

## Distribución

| Breakpoint           | Layout                                                                  |
| -------------------- | ----------------------------------------------------------------------- |
| Escritorio (≥1200px) | Sidebar de filtros sticky de 320px más un grid de 3–4 tarjetas por fila |
| Tablet (768–1199px)  | Filtros en drawer o sheet; grid de 2–3 tarjetas                         |
| Móvil (<768px)       | Una columna; barra o botón flotante para abrir filtros y orden          |

Coincidencias con el front actual: el `Drawer` ya mide 320px por defecto y `PlantsPage` ya cambia de layout a 768px. El front actual no tiene el breakpoint de 1200px.

- **Barra superior**: fija, 64px de alto, superficie blanca con borde inferior fino; navegación con subrayado de 2px en el elemento activo.
- **Tarjeta de planta**: imagen con proporción 4:3 o 1:1, nombre común en Newsreader y nombre científico como badge en cursiva.
- **Paginación**: página activa en pill con `primary-container`; el resto, texto plano con hover suave.
