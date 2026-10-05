# Contexto del sistema agro-front

> Auditoría descriptiva (cómo **es** el código, no cómo debería ser).
> Fecha: 2026-10-04 · Rama: `develop` · Último commit: `fc338b7 feat(loader): add Loader component`.
> Fuentes: código versionado (175 archivos), `contracts/openapi.yaml` (copia del contrato del backend; ver `contracts/README.md`), ejecución local de tests/lint/skott, y prototipos Stitch (solo como referencia visual, extraída a `docs/design.md`).

---

## 1. Propósito real del sistema

SPA de **solo lectura** que consume la "AgroApp API" (`agro-back`, repo aparte) para mostrar un **catálogo botánico**:

- **Plantas**: listado paginado con filtros agronómicos (familia, texto, ciclo de vida, método de siembra, luz, sistema radicular, mes de siembra con conversión de hemisferio, pH, horas de luz, espaciado, profundidad de suelo) y ficha de detalle (calendario de siembra/floración/cosecha, datos rápidos, cultivo, poda, propagación, ecología, notas, recursos: vídeos de YouTube embebidos y artículos).
- **Familias botánicas**: listado y ficha de detalle con las plantas de esa familia.
- **Home**: página informativa del proyecto (open source, sin ánimo de lucro, avisos sobre imágenes/vídeos, contacto).

Lo que **no** hace hoy (aunque hay rutas o contrato para ello):

- **Autenticación**: `/login` y `/register` existen como rutas pero renderizan solo un emoji. No hay gestión de token, ni cabecera `Authorization`, ni llamadas a `/auth/*`.
- **Admin**: `/admin` renderiza solo un emoji; el enlace en el menú está comentado.
- **Escritura**: no hay ningún `POST/PATCH/DELETE`; no se usan `ETag`/`If-Match`.
- **Bancales (`/beds`)**: existen en el contrato, sin ningún código en el front.

Idioma de la UI: español únicamente (diccionario i18n propio con una sola locale).

## 2. Inventario de módulos

Total `src/`: 118 archivos, ~4.800 líneas (≈1.700 de ellas CSS; `loader.css` sola tiene 474). No ha sido necesario dividir ningún módulo.

| Módulo                | Ruta                              | Propósito real                                                                                                                                                                                                                                           | Depende de (interno)                                                                        | Depende de (externo)             |
| --------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------- |
| **app**               | `src/app/`                        | Bootstrap: `router.tsx` (rutas con `createBrowserRouter`), `queryClient.ts` (`retry: 1`, `refetchOnWindowFocus: false`)                                                                                                                                  | layouts, pages                                                                              | react-router-dom, TanStack Query |
| **entry**             | `src/main.tsx`                    | Monta `<QueryClientProvider><RouterProvider/>` en `StrictMode` e importa `index.css`                                                                                                                                                                     | app                                                                                         | react-dom                        |
| **layout**            | `src/components/layout/`          | `MainLayout` (cabecera con marca + nav Plantas/Familias + `<Outlet/>`), `AuthLayout` (emoji + `<Outlet/>`)                                                                                                                                               | i18n, iconsMap                                                                              | —                                |
| **plants (página)**   | `src/pages/plants/` (38 archivos) | `PlantsPage` (sidebar de filtros en escritorio / drawer en móvil ≤768px) → `PlantList` (orden, límite, paginación, grid de `PlantCard`) y `PlantDetail` (8 secciones)                                                                                    | services/plants, components/plants, shared/\* , i18n, types                                 | —                                |
| **plants (filtros)**  | `src/components/plants/` (14)     | `PlantFilters` + `ToggleGroup`, `SliderFilter`, `TextFilter`, `MonthSelector`, `FamilySelect`; hooks `usePlantFilters`, `useSliderFilter`, `useDebouncedCallback`; config declarativa `filters.config.ts`; `constants.ts`; utils `mapMonth`, type guards | **pages/families/hooks/useFamilies** (dependencia inversa components→pages), i18n, iconsMap | react-router (`useSearchParams`) |
| **families**          | `src/pages/families/` (10)        | `FamilyList` (grid de enlaces), `FamilyDetail` (`FamilyHero`, `FamilyInfo`, `FamilyPlants`); hooks `useFamilies`, `useFamily`, `useFamilyPlants`                                                                                                         | services/families, **services/plants**, shared, i18n                                        | —                                |
| **auth**              | `src/pages/auth/`                 | Placeholders `Login`/`Register` (solo emoji)                                                                                                                                                                                                             | iconsMap                                                                                    | —                                |
| **admin**             | `src/pages/admin/`                | Placeholder `AdminDashboard` (solo emoji)                                                                                                                                                                                                                | iconsMap                                                                                    | —                                |
| **home**              | `src/pages/Home.tsx`              | Texto informativo + enlaces a issues de GitHub de back y front                                                                                                                                                                                           | i18n                                                                                        | —                                |
| **services**          | `src/services/`                   | `apiFetch<T>` (fetch + parseo de error → `ApiError`), `getPlants`, `getPlantById`, `getFamilies`, `getFamilyById`                                                                                                                                        | shared/errors, shared/api, types, **components/plants/PlantFilters/constants**              | `fetch`, `VITE_API_URL`          |
| **shared/api**        | `src/shared/api/QueryBuilder.ts`  | Builder inmutable sobre `URLSearchParams`; descarta `undefined`/`null`/strings en blanco; `addArray` une con comas                                                                                                                                       | types/Primitive                                                                             | —                                |
| **shared/errors**     | `src/shared/errors/`              | `ApiError` (`status`, `errors`), `toUiError` (→ `{message, details[]}`)                                                                                                                                                                                  | i18n                                                                                        | —                                |
| **shared/components** | `src/shared/components/` (16)     | `Badge` (archivo `Bagde.tsx`), `BodySection`, `Drawer`, `ErrorResponse`, `LimitSelector` (25/50/100), `Loader` (animación CSS), `OrderSelector`, `Pagination`                                                                                            | i18n, iconsMap                                                                              | —                                |
| **shared/hooks**      | `src/shared/hooks/`               | `useMediaQuery`, `useDrawer`                                                                                                                                                                                                                             | —                                                                                           | `matchMedia`                     |
| **shared/utils**      | `src/shared/utils/`               | `buildPaginationPages`, `parsePositiveInt`, `safeNumber`, `capitalizeFirstLetter`, `getDomainFromUrl`, `formatRange` (sin uso)                                                                                                                           | types                                                                                       | —                                |
| **shared/reactQuery** | `queryDefaults.ts`                | `QUERY_DEFAULTS = { staleTime: 1 día, gcTime: 7 días }`, aplicado en todos los `useQuery`                                                                                                                                                                | —                                                                                           | —                                |
| **shared/constants**  | `iconsMap.ts`                     | Mapa nombre→emoji usado como sistema de iconos (≈65 entradas; las de después del comentario `/** */` no se usan salvo `water` y `testTube`)                                                                                                              | —                                                                                           | —                                |
| **i18n**              | `src/i18n/core/`                  | `dictionary` (objeto `as const`, solo español), `t(key)` con claves tipadas (`I18nKey` = DeepKeys), `tValue(group, value)` para enums (con cast `as any`)                                                                                                | —                                                                                           | —                                |
| **types**             | `src/types/`                      | Modelos de dominio escritos a mano: `Plant`, `Family`, `Metadata`, `Pagination`, `PaginatedResponse`, `Range`, `Seasons`, `Primitive`, `PlantsSortField`                                                                                                 | —                                                                                           | —                                |

Grafo de dependencias: `skott` informa **0 ciclos**.

## 3. Stack técnico real (versiones)

Rangos declarados en `package.json`; no se ha comprobado la versión exacta instalada salvo Vitest (4.1.6, visto al ejecutarlo).

| Capa                  | Paquete                                                                 | Versión                                                                                                                                                             |
| --------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime               | react / react-dom                                                       | ^19.2.6                                                                                                                                                             |
| Routing               | react-router-dom                                                        | ^7.15.0 (modo data router: `createBrowserRouter`)                                                                                                                   |
| Data fetching / caché | @tanstack/react-query                                                   | ^5.100.11 (+ devtools en devDeps, **no montados**)                                                                                                                  |
| Lenguaje              | typescript                                                              | ~6.0.2 (`target es2023`, `moduleResolution bundler`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnused*`). **No** hay `"strict": true` en `tsconfig.app.json` |
| Bundler               | vite + @vitejs/plugin-react                                             | ^8.0.12 / ^6.0.1                                                                                                                                                    |
| Tests                 | vitest + jsdom + @vitest/coverage-v8                                    | ^4.1.6 / ^29.1.1                                                                                                                                                    |
| Testing utils         | @testing-library/react / user-event / jest-dom                          | ^16.3.2 / ^14.6.1 / ^6.9.1                                                                                                                                          |
| Lint                  | eslint + typescript-eslint + react-hooks + react-refresh + regla propia | ^10.3.0 / ^8.59 / ^7.1.1 / ^0.5.2                                                                                                                                   |
| Formato               | prettier (+ eslint-config-prettier)                                     | ^3.8.3                                                                                                                                                              |
| Arquitectura          | skott (ciclos)                                                          | ^0.35.11                                                                                                                                                            |
| Git hooks             | husky + lint-staged + commitlint (conventional)                         | ^9.1.7 / ^16.4.0 / ^21.0.1                                                                                                                                          |
| Node                  | `.tool-versions`                                                        | 22.23.2 (cambio local sin commitear; en HEAD: 22.14.0). CI prueba en 22.x y 24.x                                                                                    |

No hay librería de UI, de estilos (CSS plano por componente, BEM aproximado), de formularios, de validación de esquemas (zod, etc.) ni de i18n de terceros. CSS global en `src/index.css` con tokens de espaciado `--space-1..9`; los colores van escritos a mano (`#ddd`, `#eee`, `#ccc`…), sin tokens.

## 4. Patrones arquitectónicos detectados

- **Organización por capas técnicas con agrupación parcial por feature**: `pages/<feature>/{hooks,components,utils}` conviven con `components/plants/`, `services/` y `types/` globales. Sin barrel files salvo `shared/utils/pagination/index.ts`.
- **Service → hook de React Query → componente**: cada pantalla usa un hook propio (`usePlants`, `usePlant`, `useFamilies`, `useFamily`, `useFamilyPlants`) que envuelve `useQuery` + `QUERY_DEFAULTS`. Algunos hooks devuelven la query completa (`usePlant`, `useFamily`) y otros una forma reducida `{data, loading, error}` (`usePlants`, `useFamilies`, `useFamilyPlants`): **dos convenciones conviven**.
- **La URL es la fuente de verdad de los filtros**: `usePlantFilters` escribe en `useSearchParams` y `usePlants` lee de ahí. Cambiar cualquier filtro borra `page`. El texto se aplica con debounce de 300 ms y los sliders se confirman en `onPointerUp`.
- **Configuración declarativa de filtros** (`TOGGLE_FILTERS`, `TEXT_FILTERS`, `SLIDER_FILTERS`) que se recorre en `PlantFilters`.
- **Traducción de parámetros UI → contrato** en `getPlants` (`filter[x][op]=…`, `pagination[…]`, `sort[…]`) mediante `QueryBuilder`.
- **Normalización de errores**: `apiFetch` lanza `ApiError(message, status, errors)` → `toUiError` → `<ErrorResponse/>`.
- **Composición de la ficha de detalle**: `BodySection` como contenedor genérico + `InfoRow`/`CalendarRow`/`MonthChips`.
- **Responsive por JS**: `useMediaQuery('(max-width: 768px)')` decide si se pinta el sidebar o el drawer (no solo CSS).
- **Conversión de hemisferio solo en cliente**: `mapMonth(m, 'south') = ((m+5)%12)+1`; el backend siempre trabaja con meses del hemisferio norte.

## 5. Puntos de entrada

Es una SPA: no tiene CLIs, jobs, colas ni schedulers.

**Bootstrap**: `index.html` → `src/main.tsx` → `RouterProvider(router)`.

**Rutas** (`src/app/router.tsx`):

| Ruta            | Layout     | Componente       | Estado                           |
| --------------- | ---------- | ---------------- | -------------------------------- |
| `/`             | MainLayout | `Home`           | Funcional (estático)             |
| `/plants`       | MainLayout | `PlantsPage`     | Funcional                        |
| `/plants/:id`   | MainLayout | `PlantDetail`    | Funcional                        |
| `/families`     | MainLayout | `FamilyList`     | Funcional (sin gestión de error) |
| `/families/:id` | MainLayout | `FamilyDetail`   | Funcional                        |
| `/admin`        | MainLayout | `AdminDashboard` | Placeholder (emoji)              |
| `/login`        | AuthLayout | `Login`          | Placeholder (emoji)              |
| `/register`     | AuthLayout | `Register`       | Placeholder (emoji)              |

No hay ruta 404 ni `errorElement`, y no hay guards de autenticación.

**Query params de `/plants`** (contrato interno URL ↔ UI): `page`, `limit`, `sortDirection`, `family`, `identity`, `lifeCycle`, `sowingMethod`, `lightType`, `rootSystem`, `sowingMonth` (singular), `hemisphere` (solo UI), `soilPh`, `lightHoursMin`, `spacingCm`, `soilAvailableDepthCm`.

**Llamadas HTTP salientes** (todas `GET`, sin auth):

| Función           | Endpoint                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `getPlants`       | `GET /api/v1/plants?filter[...]&pagination[page]&pagination[limit]&sort[name]=asc\|desc` |
| `getPlantById`    | `GET /api/v1/plants/{id}`                                                                |
| `getFamilies`     | `GET /api/v1/families?pagination[limit]=100&sort[name]=asc`                              |
| `getFamilyById`   | `GET /api/v1/families/{idOrSlug}`                                                        |
| `useFamilyPlants` | `getPlants({ family })`, es decir `GET /api/v1/plants?filter[family][eq]=…`              |

## 6. Modelo de datos

El front no tiene persistencia propia (ni `localStorage`, ni IndexedDB, ni migraciones). El modelo lo define el contrato **`contracts/openapi.yaml`** (OpenAPI 3.0.3, "AgroApp API" v1.0.0). **Confirmado por el propietario: `openapi.yaml` es la fuente de verdad actual.** Cuando el front y el contrato no coinciden, el que está mal es el front. Los tipos de `src/types/` son una **copia manual** que ya ha divergido, y las fixtures de `tests/fixtures/` siguen esa misma forma antigua.

### 6.1 Recursos del contrato

| Recurso  | Endpoints                                                                                                      | Notas clave                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Health   | `GET /health`                                                                                                  | —                                                                                                                                                                                                                                                                                                                                                                                                  |
| Auth     | `POST /auth/register`, `/login`, `/google`, `GET /auth/validate/{token}`, `POST /auth/refresh`, `/auth/update` | JWT Bearer HS256 (payload `id`, `email`, `username`, `roles` `admin`\|`user`, `iat`, `exp`; emitido por `login`, `google` y `refresh`). Register exige `id` (uuid) generado por el cliente y responde `201` **sin cuerpo** (hay que hacer login después); password de 8–64 caracteres con complejidad                                                                                              |
| Families | `GET/POST /families`, `GET/PATCH /families/{idOrSlug}`                                                         | Filtros `id, slug, name, scientificName, aliases`; orden `name, scientificName, slug`; `fields[families]` (sparse fieldset)                                                                                                                                                                                                                                                                        |
| Plants   | `GET/POST /plants`, `GET/PATCH/DELETE /plants/{id}`                                                            | Filtros (ver 6.3); orden **solo `name`, `scientificName`**; `fields[plants]`; `include=family` (devuelve `FamilySummary`). Los GET son públicos con **token opcional**: sin token o con rol `user` solo devuelven plantas `ACTIVE`; con token `admin` también las `DELETED`. Una planta `DELETED` da 404 sin token admin. **Un token mal formado o caducado → 401, también en estos GET públicos** |
| Beds     | `GET/POST /beds`, `GET/PATCH/DELETE /beds/{id}`                                                                | Todo autenticado; `Bed` incluye `plantInstances[]` (`PlantInstance` con `position {x,y}`, `growthStatus`, `instanceStatus ACTIVE\|REMOVED`)                                                                                                                                                                                                                                                        |

Comportamientos transversales del contrato:

- **Concurrencia optimista**: `ETag` = `"<version>"`. Las escrituras exigen `If-Match` (si falta, 428; si no coincide, 412).
- **PATCH** sigue la semántica JSON Merge Patch (RFC 7396).
- **Paginación** con `pagination[page]` y `pagination[limit]` (por defecto 1/25, máximo 100). La respuesta es `{data, pagination:{page,limit,totalPages,totalItems}}`.
- **Errores** `{message, errors?: Record<path,string>}` (máximo 20 entradas más `_truncated`). Cualquier campo, operador o clave desconocida devuelve **400**.

### 6.2 Divergencias entre `src/types` y el contrato

| Campo                                                                          | Front (`types/`)                              | Contrato                                                                       | Efecto observable                                                                                        |
| ------------------------------------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `Plant.version`, `Family.version`                                              | ausente                                       | `integer`                                                                      | Imposible implementar escrituras con `If-Match` sin añadirlo                                             |
| `phenology.flowering.pollination`                                              | `{ type: 'insect'\|'wind'\|'self'; agents? }` | `{ types: PollinationType[] (insect, wind, self, water, bird, bat); agents? }` | Forma distinta (`type` frente a `types[]`); la UI no lo pinta                                            |
| `status`                                                                       | `'ACTIVE'\|'INACTIVE'\|'DELETED'`             | `ACTIVE\|DELETED`                                                              | `INACTIVE` no existe                                                                                     |
| `identity.family`                                                              | `string`                                      | `string \| FamilySummary` (con `include=family`)                               | El front nunca usa `include`, así que `PlantHero` muestra el **id de la familia** como texto del badge   |
| `identity.scientificName`                                                      | opcional                                      | requerido                                                                      | —                                                                                                        |
| `identity.name.aliases`                                                        | requerido                                     | opcional                                                                       | `PlantCard` y `PlantDetailStickyHeader` hacen `.aliases.length` sin guarda, por lo que fallaría si falta |
| `knowledge`                                                                    | requerido                                     | `nullable`, opcional en el GET                                                 | `PlantDetail` accede a `knowledge.soil…` sin guardas                                                     |
| `knowledge.ecology.strategicBenefits`                                          | requerido                                     | `ecology` y `strategicBenefits` opcionales                                     | `PlantEcology` hace `benefits.length` sin guarda                                                         |
| `knowledge.watering.frequency`                                                 | `'daily'\|'weekly'` (+ `amountMm`)            | texto libre; `amountMm` no existe                                              | `QuickFacts` tiene además una etiqueta `biweekly`                                                        |
| `knowledge.light.type` / `preference` / `rootSystem.type` / `resources[].type` | enums cerrados                                | texto libre (`RequiredShortText`)                                              | Un valor nuevo del backend se muestra como clave sin traducir                                            |
| `Metadata.createdAt/updatedAt`                                                 | `Date`                                        | `string (date-time)`                                                           | Tipado incorrecto (llega string)                                                                         |
| `deletedAt`                                                                    | `Date \| null`                                | `string \| null`                                                               | Ídem                                                                                                     |
| `phenology.flowering` / `harvest`                                              | requeridos                                    | requeridos en la respuesta, opcionales al crear                                | —                                                                                                        |
| `Family.extra.subfamilies`                                                     | presente                                      | presente                                                                       | Se declara pero no se pinta                                                                              |

Alineado con el contrato: `traits.ecological` (`edible`, `toxic`, `toxicityNotes`, todas opcionales; una clave ausente es "sin dato").

### 6.3 Divergencias en las peticiones (consultas de listado)

| Parámetro enviado                                                                             | Contrato                                | Riesgo                                                                                                                                                             |
| --------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `filter[family][eq]=<valor>`                                                                  | `eq` debe ser `uuid`                    | En el listado solo se envía si el valor de la URL es un uuid (feature 003). `useFamilyPlants` sigue pasando el id de la ruta, que puede ser un slug: con slug, 400 |
| `pagination[limit]=<limit de la URL>`                                                         | máximo 100                              | Resuelto (feature 003): solo se envía 25, 50 o 100; cualquier otro valor de la URL se corrige a 25                                                                 |
| `sort[<campo>]` desde `sortField`/`sortDirection`                                             | `name`, `scientificName`; `asc`, `desc` | Resuelto (features 002 y 003): claves de `services/plantListQuery.ts`; valores de la URL fuera de esas listas se ignoran                                           |
| `filter[lightType][eq]` con `full_sun\|partial_shade`, `filter[rootSystem][eq]` con 6 valores | texto libre                             | Los filtros solo funcionan si los datos usan exactamente esos literales                                                                                            |
| `getFamilies` con `pagination[limit]=100`                                                     | máximo 100                              | Con más de 100 familias, el `FamilySelect` queda truncado sin aviso                                                                                                |
| `useFamilyPlants` sin paginación                                                              | 25 por defecto                          | La ficha de familia muestra como máximo 25 plantas, sin indicarlo (el enlace "ver todas" sí lleva al listado filtrado)                                             |

## 7. Dependencias externas

| Dependencia                   | Uso                                                                                                | Configuración                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **AgroApp API** (`agro-back`) | Única fuente de datos                                                                              | `VITE_API_URL` (prefijo concatenado a `/api/v1/...`) |
| **YouTube**                   | `<iframe>` embebido (`https://www.youtube.com/embed/{id}`) desde `knowledge.resources[type=video]` | Sin atributos `sandbox`, `allow` ni `loading="lazy"` |
| **URLs externas de imágenes** | `<img src>` = primer `resources[type=image].url`                                                   | Sin `loading="lazy"` ni fallback                     |
| **Artículos externos**        | `<a target="_blank" rel="noopener noreferrer">`                                                    | —                                                    |
| **SonarCloud**                | Análisis estático y cobertura (`vinjatovix_agro-front`)                                            | Secret `SONAR_TOKEN`                                 |
| **GitHub Actions**            | CI (ver 8.3)                                                                                       | —                                                    |
| **Railway**                   | Hosting y deploy del front                                                                         | `VITE_API_URL` por entorno, configurada a mano       |

No hay analítica, Sentry, feature flags, CDN de fuentes ni service worker.

## 8. Convenciones de código observadas

### 8.1 Código

- **Componentes**: `export default function X()` en la mayoría. Excepciones con export nombrado: `Loader`, `ErrorResponse`, `FamilyHero`, `PlantDetailStickyHeader` (este último como arrow function).
- **Props**: `interface Props` con todas las propiedades `readonly`.
- **CSS**: un `.css` junto a cada componente, importado desde él. Clases tipo BEM (`plant-filters__toggle--active`) y nombres de archivo en camelCase (`plantCard.css`). No hay CSS modules.
- **Textos**: todo pasa por `t('a.b.c')` con claves tipadas. La regla ESLint propia `local/no-hardcoded-ui-text` (warning) **solo detecta `JSXText`**, así que no ve strings dentro de objetos ni template literals (por ejemplo, las etiquetas de `QuickFacts` o el texto `"al día"`).
- **Iconos**: emojis vía `iconsMap.<clave>` interpolados en los textos de etiquetas. **Decidido: se sustituirán por iconos de Material Symbols** (ver 11.3 y `docs/design.md`). Hoy los emojis también aparecen en `BodySection` (y por tanto en su `data-testid`), en `ErrorResponse`, en `Pagination` y en los textos fijos de `FamilyInfo` (`📝`, `🌟`) y `SliderFilter` (`❌`).
- **Imports**: rutas relativas (sin alias `@/`). Se usa `import type` (lo exige `verbatimModuleSyntax`).
- **Hooks de datos**: `queryKey` en forma de array. El listado usa la factoría `plantKeys.list(request)` (`src/shared/reactQuery/plantKeys.ts`) → `['plants', 'list', request]`, con la petición ya saneada; el resto: `['plant', id]`, `['families']`, `['family', id]`, `['family-plants', familyId]`.
- **`data-testid`** se usa ampliamente en componentes interactivos.
- **Formato**: Prettier con `printWidth: 80`, `singleQuote: true`, `semi: true`, `trailingComma: 'none'` y `arrowParens: 'always'`.
- **Commits**: Conventional Commits con scope por feature (`feat(plants): …`), validados por commitlint en local (husky) y en los PR. 42 commits en el historial.

### 8.2 Gates locales (husky)

- `pre-commit`: `lint-staged` (`eslint --fix` + `prettier --write` sobre ts/tsx; prettier sobre json/md/css).
- `commit-msg`: commitlint.
- `pre-push`: `check-circular` + `npm run test`.

### 8.3 CI/CD (`.github/workflows/`)

| Workflow             | Disparador                           | Pasos                                                                                                  |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `ci.yml`             | PR (todos) y push a `develop`/`main` | Matriz Node 22.x y 24.x: `npm ci`, lint, format:check, typecheck, check-circular, test:coverage, build |
| `commitlint.yml`     | PR                                   | `wagoid/commitlint-github-action@v6`                                                                   |
| `sonarqube.yml`      | push a `main`/`develop` y PR         | test:coverage y SonarQube scan (actions fijadas por SHA)                                               |
| `release-please.yml` | push a `main`                        | `release-please-action@v4`, `release-type: node` (changelog y tag). `version` sigue en `0.0.0`         |

**Deploy**: en **Railway**, fuera de GitHub Actions; no hay ningún workflow ni archivo de configuración de deploy en el repo. Hay dos entornos:

- **dev**: se despliega automáticamente al mergear en `develop`.
- **prod**: existe pero todavía no tiene nada desplegado. **Se desplegará desde `main`** (confirmado), lo que encaja con `release-please`, que se ejecuta en push a `main`.

`VITE_API_URL` se configura **a mano** en las variables de cada entorno. Como Vite incrusta `import.meta.env` al compilar, cambiar una variable exige volver a construir.

Nota: `npm run typecheck` ejecuta `tsc --noEmit` (sin `-b`) contra el `tsconfig.json` raíz, que tiene `"files": []` y solo `references`. Sin `-b`, `tsc` no sigue las referencias, así que **ese paso no comprueba ningún archivo**. El chequeo de tipos real en CI ocurre en el paso `build` (`tsc -b`).

### 8.4 Configuración y secrets

- `.env` (sin versionar): `VITE_API_URL`. Es la única variable leída hoy (`src/services/api.ts`). No hay `.env.example`.
- Variable prevista (aún sin uso): `VITE_GOOGLE_CLIENT_ID`, que debe coincidir con el `GOOGLE_CLIENT_ID` del back. Es pública. Hoy no hay un valor real en ningún entorno (ver 11.2).
- Secrets de CI: `SONAR_TOKEN`. No hay feature flags.

## 9. Cobertura de tests por módulo (aproximada)

Ejecución local (2026-10-04): **27 ficheros, 148 tests, todos pasan**. Cobertura v8 global: **92,75 % statements / 83,96 % branches / 91 % funcs / 92,68 % lines**.

⚠️ Esa cifra **solo incluye los archivos que algún test importa**. Los archivos que nunca se importan no aparecen en el informe, así que el porcentaje real del repo es menor.

| Módulo                                                                         | Tests                     | Cobertura (aprox.)                                                                                                               | Calidad observada                                                                                                                 |
| ------------------------------------------------------------------------------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| app (router, queryClient, main)                                                | ninguno                   | 0 % (fuera del informe)                                                                                                          | —                                                                                                                                 |
| layout (`MainLayout`, `AuthLayout`)                                            | ninguno                   | 0 % (fuera del informe)                                                                                                          | —                                                                                                                                 |
| Home, auth, admin                                                              | ninguno                   | 0 % (fuera del informe)                                                                                                          | Placeholders                                                                                                                      |
| plants: `PlantsPage`, `PlantList`, `PlantCard`, `PlantDetail` y subcomponentes | 6 ficheros                | 85–100 % líneas, ramas 50–75 % en `QuickFacts`, `PlantCultivation`, `PlantEcology`, `PlantNotes`                                 | Tests de componente con RTL. `PlantList` se prueba contra `fetch` con el hook real (feature 003); `PlantsPage` mockea `usePlants` |
| plants: `usePlants`                                                            | 1                         | 100 % líneas                                                                                                                     | Mockea `plants.service`. Devuelve `{ query, request, …setters }`; la URL se sanea en `parsePlantListSearchParams`                 |
| plants: utils                                                                  | `getYoutubeEmbedUrl`      | alta                                                                                                                             | Unitarios puros. `findPlantImage` no tiene test directo                                                                           |
| components/plants: `PlantFilters`, `usePlantFilters`, `useDebouncedCallback`   | 3                         | 89–93 %. **`plantFilter.utils` 0 %** (los type guards se mockean de forma indirecta). `SliderFilter` 50 %                        | Interacción con `user-event`                                                                                                      |
| families (páginas y hooks)                                                     | 5                         | `FamilyDetail` 87,5 %. Hooks cubiertos                                                                                           | Mockean services                                                                                                                  |
| services: `api.ts`                                                             | 1                         | 100 % líneas                                                                                                                     | Mockea `fetch`. Cubre errores JSON y no JSON                                                                                      |
| services: `plants.service.ts`                                                  | ninguno directo           | **0 %** (siempre se mockea)                                                                                                      | **La traducción a `filter[...]`/`sort[...]` no está probada**, que es justo donde está la divergencia con el contrato             |
| services: `families.service.ts`                                                | ninguno directo           | 50 %                                                                                                                             | —                                                                                                                                 |
| shared/api `QueryBuilder`                                                      | 1                         | 87,5 %                                                                                                                           | Unitario                                                                                                                          |
| shared/errors                                                                  | 2                         | 85–100 %                                                                                                                         | Unitario                                                                                                                          |
| shared/components                                                              | `Drawer`, `ErrorResponse` | `Pagination` 75 % (vía otros tests). `Badge`, `BodySection`, `Loader`, `LimitSelector` y `OrderSelector` solo de forma indirecta | —                                                                                                                                 |
| shared/hooks                                                                   | 2                         | alta                                                                                                                             | `useMediaQuery` mockea `matchMedia`                                                                                               |
| shared/utils                                                                   | 3 + pagination            | 95–100 %. `formatRange` sin test (y sin uso)                                                                                     | Unitarios puros                                                                                                                   |
| i18n                                                                           | `t`, `tValue`             | 100 %                                                                                                                            | Unitario                                                                                                                          |

Infraestructura de tests: `tests/test-utils/renderWithProviders.tsx` (QueryClient de test + `MemoryRouter`) y `createTestQueryClient` (`retry:false`, `gcTime:0`). Hay fixtures en `tests/fixtures/{plants,families}`. Usan la forma de `src/types`, no la del contrato; como el contrato es la fuente de verdad, **las fixtures están desactualizadas**. No hay MSW, tests E2E ni tests de contrato contra `openapi.yaml`.

Estado de lint: 0 errores, 12 warnings (`no-hardcoded-ui-text`: 1 en `Home.tsx`, 10 en `Drawer.test.tsx`, 1 en `PlantDetail.test.tsx`).

## 10. Deuda técnica y zonas de peligro

### Alta (puede romper en producción)

1. ~~**Orden del listado fuera de contrato**~~ (corregido en la feature 002, `fix(plants): use contract sort keys`): `getPlants` envía `sort[name]` o `sort[scientificName]`; las claves permitidas viven en `services/plantListQuery.ts` (feature 003).
2. **Tipos de dominio desincronizados con el contrato** (ver 6.2): `pruning.seasons`, `propagation.seasons` y `pollination.types` llegan con otra forma, por lo que hoy se pintan claves i18n crudas. Además hay campos opcionales tratados como obligatorios (`aliases`, `knowledge`, `ecology`), lo que puede provocar un `TypeError` en render. No hay validación en tiempo de ejecución (`apiFetch` hace `as T`).
3. **Sin `errorElement` ni ErrorBoundary**: `PlantDetail` y `FamilyDetail` hacen `throw new Error('Invalid route…')`, y cualquier excepción de render tumba la app.
4. **`FamilyList` ignora `error`**: si la API falla, muestra la lista vacía.

### Media

5. **Slug frente a id**: `/families/:id` acepta slug en el GET, pero ese valor se usa como `filter[family][eq]` (uuid), lo que da 400 o una lista vacía.
6. ~~**`limit` sin máximo**~~ (corregido en la feature 003): `parsePlantListSearchParams` solo admite los límites del selector (25, 50, 100).
7. **El badge de familia en `PlantHero` muestra el UUID**: no se usa `include=family`. Además el `TODO` de `useFamilyPlants.ts:12` habla de "projected fields", que el backend **ya ofrece** (`fields[plants]`).
8. **i18n incompleta**: `QuickFacts` tiene diccionarios de etiquetas propios (`LIFE_CYCLE_LABELS` duplica `lifeCycleValues` con otro texto: "Pleno sol" frente a "Sol pleno"), y hay literales como `"al día"`, `"cm"`, `"❌"`, `"Close drawer"`, `"Pagination"` y los meses `Jan…Dec` en inglés con la UI en español. La regla ESLint no los detecta.
9. **Acoplamiento inverso**: `components/plants/FamilySelect` importa `pages/families/hooks/useFamilies`; `PlantDetail/MonthChips` importa de `components/plants/PlantFilters`.
10. **Duplicidad de estado de hemisferio**: en el listado vive en la URL (`?hemisphere`) y en el detalle en un `useState` local (no se comparte; al navegar vuelve a "north").
11. **`sowingMonth` singular**: la UI permite un solo mes aunque el contrato admite `hasAny` con varios.
12. **`useSliderFilter`** sincroniza estado en un `useEffect` con `eslint-disable react-hooks/set-state-in-effect`.
13. **Convenciones de retorno de hooks inconsistentes** (query completa frente a `{data, loading, error}`).
14. **`tsconfig.app.json` sin `strict`**, y el script `typecheck` no comprueba nada (`tsc --noEmit` sobre un `tsconfig` con `files: []`). Solo `build` (`tsc -b`) detecta errores de tipos. Ni `npm run check` ni el `pre-push` los detectan.

### Baja / higiene

15. **Código muerto**: `formatRange` (sin uso); ~20 entradas de `iconsMap` tras `/** */` sin uso; claves i18n sin uso (`app.welcome_message`, `common.save`, `common.cancel`, `common.not_found`, `plant.filters.aliases`, `plant.filters.light`, `plant.filters.strategicBenefits`); `useDrawer().toggle` sin uso; `react-query-devtools` instalado y sin montar; los tipos `Seasons` y `Range` son muy finos.
16. **Typo en nombre de archivo**: `shared/components/Badge/Bagde.tsx`.
17. **`tValue` usa `as any`**: un valor desconocido devuelve la clave cruda en silencio.
18. **`BodySection`** genera `data-testid` a partir del título con emoji (`section-🌿 plantas`), lo que lo hace frágil.
19. **`Drawer`** sin foco atrapado ni `role="dialog"`/`aria-modal`. Los `<iframe>` de YouTube no tienen `loading="lazy"` ni `sandbox`.
20. **`loader.css`** tiene 474 líneas (animación decorativa), un tercio del CSS total.
21. **README** con una sola línea; `docs/` estaba vacío; no existe `.env.example`.
22. **`.tool-versions`** modificado localmente (Node 22.14.0 → 22.23.2) sin commitear.

### Riesgos que aparecerán al implementar auth (detectados al cruzar con las respuestas del back)

23. **`apiFetch` siempre hace `response.json()`** en respuestas OK, así que falla con respuestas sin cuerpo. Inventario confirmado por el back:

    | Endpoint                                 | Respuesta                                                     |
    | ---------------------------------------- | ------------------------------------------------------------- |
    | `POST /auth/register`                    | `201` sin cuerpo ni `content-type` (`res.status(201).send()`) |
    | `POST /plants`                           | `201` + `Plant` + `ETag`                                      |
    | `POST /families`                         | `201` + `Family`                                              |
    | `POST /beds`                             | `201` + `Bed`                                                 |
    | `DELETE /plants/:id`, `DELETE /beds/:id` | `204` sin cuerpo                                              |

    **Criterio acordado con el back**: `apiFetch` decide según la respuesta, no según el código de estado. Lee JSON solo si `status !== 204` y el `content-type` incluye `application/json`; en cualquier otro caso devuelve `undefined`. **No** basta con dejar de leer JSON en todos los 201, porque el resto de los 201 traen el recurso creado y el front lo necesita.

    **ETag en los 201 (confirmado)**: `POST /plants`, `POST /families` y `POST /beds` devuelven `ETag` (`setVersionETag`). El front puede usarlo como `If-Match` en un PATCH o DELETE justo después de crear, sin repetir el GET.

24. **Caché sin identidad**: las `queryKey` no incluyen al usuario ni su rol, y `QUERY_DEFAULTS.staleTime` es de 1 día. Un admin vería datos cacheados sin las plantas borradas (o al revés tras un logout) si no se invalida o se segmenta la caché.
25. **`apiFetch` sobrescribe `headers`**: `{ headers: {...}, ...options }` hace que unas `options.headers` (por ejemplo `Authorization` o `If-Match`) eliminen el `Content-Type`. Además envía `Content-Type: application/json` también en los GET.
26. **Token caducado en endpoints públicos → 401**: según el contrato actualizado, `GET /plants` y `GET /plants/{id}` responden 401 si el token está mal formado o caducado, aunque sean públicos. Si el front adjunta el token sin comprobar `exp`, una sesión caducada **rompe el catálogo público**. El front no debe enviar un token caducado y, ante un 401, debe limpiar la sesión y repetir la petición sin token o mandar al login, según la pantalla.

Marcadores encontrados: 1 `TODO` (`useFamilyPlants.ts:12`), 2 `eslint-disable` (`useSliderFilter.ts:9`, `tValue.ts:14`). No hay ningún `FIXME`, `HACK` ni `XXX`.

## 11. Pendientes y NEEDS-CLARIFICATION

**Estado a 2026-10-04: no queda ningún `[NEEDS-CLARIFICATION]` abierto.** Todo lo que estaba pendiente se ha resuelto con el propietario o con el equipo de back; lo que sigue es el registro de esas respuestas y decisiones. Lo único que queda fuera del front es configurar un `GOOGLE_CLIENT_ID` real en Google Cloud (ver 11.2).

### 11.1 Decisiones y contexto confirmados (2026-10-04)

**Por el propietario del front:**

- **Contrato**: `openapi.yaml` es la fuente de verdad actual. Por tanto, las divergencias de 6.2 y 6.3 son **bugs del front**: orden de plantas, `seasons[]` en poda y propagación, `pollination.types[]`, `status` sin `INACTIVE`, enums cerrados que el contrato define como texto libre, y opcionalidad de `aliases`, `knowledge` y `ecology`.
- **Deploy**: Railway; `VITE_API_URL` se configura a mano en cada entorno (ver 8.3).
- **Iconos**: los emojis de `iconsMap` se sustituyen por iconos.
- **Diseño**: se deja a elección del arquitecto. La decisión y los tokens están en `docs/design.md`.

**Por el equipo de backend:**

_Autenticación_

- JWT Bearer devuelto en el body (`{ token }`) por `POST /auth/login` y `/auth/google`. `/auth/register` responde `201` sin token (corregido en la segunda ronda, ver 11.2). No hay cookies, aunque el CORS tenga `credentials: true`.
- El front debe enviar `Authorization: Bearer <token>`.
- La caducidad la fija `JWT_DEFAULT_DURATION` (2h; leer `exp` del JWT, ver 11.2). `POST /auth/refresh` exige un token **todavía válido**; si ya caducó, hay que volver a hacer login.
- Payload del token: `id`, `email`, `username`, `roles[]` (`"admin"` o `"user"`). El front puede decodificarlo para mostrar u ocultar la interfaz de admin, pero **la autorización real la hace el backend** (middleware `isAdmin`).
- Almacenamiento recomendado: `sessionStorage` más una copia en memoria (sobrevive a F5 y desaparece al cerrar la pestaña). No usar `localStorage`. Renovar con `/auth/refresh` un poco antes de que caduque.

_Matriz de acceso_

| Pantalla / operación                     | Acceso                                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| Login, registro, Google, validar email   | Pública                                                                             |
| Listado y detalle de plantas             | Pública con auth opcional: **un admin autenticado ve también las plantas borradas** |
| Listado y detalle de familias            | Pública                                                                             |
| Bancales (todo)                          | Requiere auth                                                                       |
| Cambiar contraseña (`POST /auth/update`) | Requiere auth                                                                       |
| CRUD de catálogo                         | Requiere auth y rol `admin`                                                         |

_Admin_

- Plantas: `POST`, `PATCH /:id` y `DELETE /:id` son solo para admin.
- Familias: `POST` y `PATCH /:idOrSlug` son solo para admin. **No existe `DELETE` de familias** (previsto en la iteración 32 del roadmap del back).
- `PATCH` y `DELETE` exigen `If-Match` con el `ETag` del último GET. `ETag` ya es legible desde el navegador (está en `exposedHeaders`). Como el GET con `fields` o `include` **no** devuelve `ETag` (ver 6.1), el front debe hacer un GET completo antes de editar.
- El rol `collaborator` (iteración 31) **todavía no existe**; el front no debe contar con él.

_Roadmap_

- **Bancales**: entran en el alcance; el CRUD completo ya está en el contrato. La colocación de plantas en un bancal y el motor espacial llegan en las fases 1 y 9–11 del back, así que el "diseñador de bancales" de Stitch aún no tiene API.
- **Enciclopedias** (fase 5, iteraciones 39–42): Plagas → `Anomaly` (plagas, enfermedades, trastornos, malas hierbas); Fertilizantes → `GardenInput` (abonos, remedios, bioestimulantes y calculadora de diluciones). El modelo está en `docs/spec/modules/knowledge.md` **del repo de back**. La lectura será pública y la escritura para admin. **Hoy no tienen endpoints**: el front debe ocultar esas pantallas o dejarlas tras un flag con datos de prueba, sin llamar a la API.

### 11.2 Huecos del contrato aclarados por el back (2026-10-04, segunda ronda)

Comportamiento real que **no está en `openapi.yaml`** y hay que tener en cuenta hasta que el contrato se actualice:

- **Plantas borradas**: con token `admin`, `GET /plants` devuelve plantas `ACTIVE` y `DELETED` **mezcladas**, que se distinguen por `status` y `deletedAt`; **no hay filtro por estado**. `GET /plants/{id}` de una planta `DELETED` responde 404 si no hay token admin. **Ya documentado en el contrato** (`security: [{}, bearerAuth]` y descripción de ambos GET).
- **Registro**: `POST /auth/register` responde `201` **sin token**; aquí el contrato es correcto. El `id` (uuid) lo genera el cliente. Flujo: **registro → login → token**. Hoy el login **no** exige el email validado (`LoginUserLocal` no lo comprueba); pasará a ser obligatorio en la **iteración 26** del roadmap del back.
- **Roles**: van dentro del JWT. Valores válidos: `"admin"` y `"user"`, en minúsculas. El back comprueba `roles.includes('admin')`. **Ya documentado en el contrato** (descripción de `securitySchemes.bearerAuth`).
- **Caducidad**: `JWT_DEFAULT_DURATION=2h` en todos los entornos. Recomendación del back: **no poner ese valor fijo en el front**, leer el `exp` del JWT y renovar entre 5 y 10 minutos antes de que caduque. Un token caducado no se puede renovar.
- **Google**: el front debe usar **el mismo `GOOGLE_CLIENT_ID` que el back** (el back solo acepta `idToken` emitidos para ese client ID). Es un valor público y puede ir en el `.env` del front (`VITE_GOOGLE_CLIENT_ID`). **Hoy todos los entornos tienen un valor de relleno, así que el login con Google no funcionará hasta que se configure un client ID real en Google Cloud.**

**Filtros de plantas (resuelto, tercera ronda)**: el back acepta exactamente los 11 filtros que declara el contrato; la validación está en `agro-back/src/apps/agroApi/controllers/Plants/requestSchemas.ts:348`. La afirmación anterior de que solo había 4 era errónea. Por tipo:

- Texto: `identity`, `lightType`, `rootSystem`.
- Identificador (uuid): `family`.
- Enumerado: `lifeCycle`, `sowingMethod` (`direct`/`starter`).
- Rango (`eq` = valor disponible, la planta coincide si su rango lo cubre): `spacingCm`, `soilPh`, `soilAvailableDepthCm`, `lightHoursMin`.
- Lista de meses: `sowingMonths` con `has` o `hasAny` (valores del 1 al 12).

Encaja con lo que envía el front (`plants.service.ts`). Siguen en pie dos matices ya descritos en 6.3: `lightType` y `rootSystem` son texto libre en el back, pero el front solo ofrece un conjunto fijo de literales; y la UI solo deja elegir un mes, aunque `hasAny` admite varios.

**Cuerpo del 201 de registro (resuelto)**: el back responde sin cuerpo y sin `content-type`, y **el contrato ya está corregido** (el `201` no tiene `content`). En el front se cubre con el criterio de `apiFetch` de la deuda 23.

Implicaciones para el front, derivadas de lo anterior (no son decisiones tomadas):

- La caché de React Query no tiene en cuenta la identidad: las `queryKey` de plantas no incluyen el usuario o el rol, y `staleTime` es de 1 día. Tras un login o logout de admin se servirían listados cacheados con o sin borradas (ver deuda 24).
- `apiFetch` no añade ninguna cabecera `Authorization` y su `...options` **reemplaza** el objeto `headers` completo, en vez de fusionarlo (ver deuda 25).

### 11.3 Decisiones del front (2026-10-04, tercera ronda)

- **Entornos**: Railway, con dev (despliegue al mergear en `develop`) y prod (vacío). Ver 8.3.
- **`openapi.yaml`**: se versiona en `agro-back` y al front se le entrega actualizado. **Decidido**: la copia se versiona en este repo en `contracts/openapi.yaml`, con un registro de entregas (fecha, origen y SHA-256) en `contracts/README.md`. No se edita en el front. Si se generan tipos a partir de él (openapi-typescript, por ejemplo) se decide en el plan de la spec de alineación con el contrato.
- **Idioma**: **solo castellano**, pensado para todo el público hispanohablante. No hay multi-idioma en el horizonte cercano; el contenido de las plantas no se traduce. Consecuencias:
  - Se mantiene el `t()` propio con una sola locale; no hace falta ninguna librería de i18n.
  - **Convención de datos (confirmada)**: en la BD las **claves** (valores de enumeraciones como `annual`, `full_sun`, `direct`, las claves de los métodos de propagación, las estaciones, `ACTIVE`…) están **en inglés**, y los **valores de texto libre** (descripciones, notas, buenas prácticas, nombres…) están **en castellano**. El front muestra siempre castellano: traduce las claves con el diccionario (`tValue`) y pinta el texto libre tal cual. Los meses llegan como números del 1 al 12 y es el front quien les pone nombre.
  - Hay que pasar a castellano los literales de la UI que hoy están en inglés (meses `Jan…Dec`, `"Close drawer"`, `"Pagination"`).
  - Como el contrato define como texto libre campos que el front trata como enumeraciones (`lightType`, `rootSystem.type`, `pruning.type`…), una clave que no esté en el diccionario se ve sin traducir. Hoy `tValue` devuelve la clave en silencio.
  - Al dirigirse a todo el público hispanohablante, el selector de **hemisferio** gana peso: buena parte de ese público está en el hemisferio sur.
- **Iconos (delegado en el arquitecto)**: **Material Symbols Outlined**. Motivos: es la familia que usan los prototipos de Stitch, así que encaja con la referencia visual, y cubre mejor el dominio agrícola y botánico (`eco`, `potted_plant`, `grass`, `water_drop`, `compost`, `pest_control`…). Se carga como **SVG empaquetado, no como fuente web**, para no descargar la fuente completa ni ver un parpadeo de texto en lugar del icono. `iconsMap` pasa a ser un mapa de nombre de dominio a icono detrás de un componente `<Icon name=… />`, de modo que la sustitución quede en un solo sitio. El paquete y la forma concreta de importarlo se eligen en el plan de la spec.

### 11.4 Feature flags

Opciones valoradas:

| Opción                                                                                                     | A favor                                                                                                                       | En contra                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Variables de build por entorno** (`VITE_FEATURE_ENCYCLOPEDIAS=true` en Railway dev y `false` en prod) | Sin trabajo en el back. Encaja con la necesidad actual: ocultar pantallas sin API en prod y verlas en dev con datos de prueba | Cambiar un flag exige reconstruir; no permite flags por usuario                                                                              |
| **B. Colección de configuración en la BD**, servida por un endpoint del back                               | Se cambia en caliente; permitiría flags por rol o por usuario                                                                 | Requiere endpoint, contrato, permisos de admin y caché en el back; ese endpoint no existe hoy. Mientras carga hay que decidir qué se muestra |

**Recomendación: A ahora y B solo cuando aparezca una necesidad real de cambiar flags en caliente o por usuario.** Con solo dos entornos y un único caso de uso (las enciclopedias), B añade trabajo en dos repos sin ganar nada concreto hoy. Para que el paso a B no cueste, el front leería los flags siempre a través de un único módulo (`features.ts`, por ejemplo), de forma que solo cambiara el origen del dato.

**Decisión (confirmada): opción A**, variables `VITE_FEATURE_*` en el `.env` de cada entorno de Railway, leídas desde un único módulo del front.

---

## Anexo A: Referencia visual

La referencia visual (paleta, tipografía, forma, espaciado y distribución) y las decisiones de diseño e iconos están en **`docs/design.md`**.

Los prototipos de Stitch de los que sale esa referencia **no se versionan** (están en `.gitignore`). Por indicación del propietario, de ellos solo valen los colores y la distribución; **el contenido y los componentes no son correctos**. Incluían catálogo de plantas, ficha de planta, familias, login, registro, diseñador de bancales y enciclopedias de plagas y de fertilizantes. Las enciclopedias y el diseñador de bancales **todavía no tienen API** (ver 11.1).
