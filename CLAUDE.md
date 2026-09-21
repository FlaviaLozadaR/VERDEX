# Verdex — contexto completo del proyecto

Este documento existe para que cualquier persona (o cualquier sesión de IA) que abra esta
carpeta entienda TODO el proyecto sin tener que preguntar de nuevo: qué es Verdex, por qué
se está reconstruyendo, qué tecnologías se eligieron y por qué, cómo está estructurado el
código, qué se decidió sobre la base de datos, y qué falta. Está escrito de lo más general
(el negocio) a lo más técnico (el código), a propósito.

---

## PARTE 1 — Qué es Verdex (el negocio, en lenguaje normal)

Verdex es una startup boliviana de reciclaje con recompensas. Nació de un equipo
universitario que ganó la Feria de Innovación de la UPSSA, clasificó como finalista
nacional en ElevateU, y ganó también la Feria de Emprendimiento de CAINCO — y a raíz de
eso, varias empresas mostraron interés real en trabajar con ellos. Esa tracción es la
razón por la que el proyecto pasó de ser un MVP de feria a algo que hay que reconstruir
bien, pensado para escalar.

### El pitch, resumido

La idea central: **una botella de plástico puede generar valor para todos**. Hoy en
Bolivia miles de toneladas de residuos reciclables terminan en rellenos sanitarios cada
año, no porque a la gente no le importe, sino porque el sistema está desconectado:

- Las **personas** no tienen incentivos para reciclar.
- Las **empresas** no tienen datos para medir su impacto ambiental.
- Los **recicladores** (los operadores que hacen el trabajo físico de acopio) trabajan
  con muy poca digitalización.

Verdex conecta a estos tres actores en un mismo ecosistema tecnológico:
- Los usuarios reciclan y obtienen recompensas reales (café gratis, descuentos,
  sorteos, donaciones a ONGs).
- Las empresas reciben un **Dashboard ESG** con métricas reales de impacto para sus
  reportes de sostenibilidad.
- Los recicladores digitalizan su proceso de acopio y su cobro (Bs 2/kg aprox.).

La frase que resume todo el modelo: **"Transformamos residuos en datos, datos en
impacto e impacto en valor."**

### El modelo de negocio
    
B2B, enfocado en empresas: suscripción al Dashboard ESG, campañas de sostenibilidad, y
alianzas estratégicas. Es un flywheel: mientras más empresas participan, mejores
incentivos reciben los usuarios; mientras más usuarios reciclan, más valor obtienen las
empresas.

### Estado de validación (a la fecha de este documento)

- MVP funcional, en validación con usuarios reales.
- Pilotos en desarrollo.
- Ganador: Feria de Innovación UPSSA.
- Finalista nacional: ElevateU.
- Ganador: Feria de Emprendimiento CAINCO — este último logro es el que generó interés
  real de empresas y disparó la decisión de reconstruir todo el producto en serio.

### Quién lidera esto

Andrés Melgar, CEO, junto con su equipo (el mismo equipo que ganó las ferias
mencionadas).

---

## PARTE 2 — Por qué se está reconstruyendo desde cero

El primer prototipo (que vive en una carpeta completamente separada, `d:/Verdex`, y que
**no hay que tocar ni mezclar con este proyecto**) era un React + Vite de una sola
pieza, sin backend real, con todo guardado en `localStorage`, y con un solo tipo de
usuario real implementado (el usuario que recicla). Servía perfecto para pitchear en una
feria, pero no aguanta lo que viene: empresas reales pagando por un dashboard, múltiples
roles con datos que no se pueden mezclar entre sí, y la necesidad de que el producto
exista como app móvil y como sitio web al mismo tiempo.

Esta carpeta (`Verdex-Platform`) es la reconstrucción completa, pensada para eso desde
el día uno.

---

## PARTE 3 — Los 4 roles del ecosistema

Este es el punto de partida de todo el diseño técnico. Verdex no es una app de "un solo
tipo de usuario" — son 4 roles con necesidades completamente distintas:

1. **Usuario / Cliente** — la persona que recicla. Usa principalmente la app móvil:
   escanea QR al depositar material, gana puntos, canjea recompensas, ve su progreso de
   nivel (gamificación tipo Semilla → Brote → Árbol → Bosque).

2. **Empresa** — el cliente B2B que paga por el Dashboard ESG. Usa principalmente la
   web: ve métricas de impacto (kg reciclados, CO₂ evitado, agua ahorrada, usuarios
   activos afiliados), tendencia mensual, ranking por sede/campus, y puede descargar un
   certificado de impacto. También gestiona su suscripción y a sus empleados afiliados.

3. **Reciclador / Operador de acopio** — **este es el rol que faltaba en el prototipo
   viejo**, y es literalmente uno de los tres pilares del pitch original ("recicladores
   digitalizan su proceso"). Sin este rol, nadie del lado físico confirma que lo que un
   usuario dijo haber depositado es real — lo cual significa que el Dashboard ESG que
   ven las empresas hoy no tiene verificación de campo. Este rol usa la app móvil:
   valida en persona el peso/material real de cada depósito, gestiona su zona de puntos
   de acopio, y ve sus pagos (Bs/kg acumulado).

4. **Admin / Equipo Verdex (interno)** — el equipo de Verdex mismo. Usa un panel web
   interno: aprueba empresas nuevas, gestiona el catálogo de recompensas, concilia pagos
   a recicladores, monitorea fraude/anomalías, y administra permisos del propio equipo.

Un **5to rol posible a futuro** (no implementado todavía, pero el modelo de datos lo
deja abierto): **Aliado de canje** — el negocio (cafetería, tienda) que entrega la
recompensa y necesitaría validar el código de canje desde su propio punto de venta.

---

## PARTE 4 — Las decisiones de tecnología, y el porqué de cada una

Esta sección importa tanto como el código: casi todas estas decisiones fueron discutidas
y comparadas contra alternativas antes de elegirlas. No son defaults — son elecciones.

### La superficie completa: 2 apps, no 4

Aunque hay 4 roles, solo se construyen **2 superficies de frontend**, no 4 apps
separadas (eso triplicaría login, deploys y mantenimiento):

- **`apps/mobile`** sirve a **Usuario** y **Reciclador** — ambos roles trabajan "en
  movimiento" (escanear, validar en campo), así que tiene sentido que compartan una app,
  con navegación distinta según el rol autenticado.
- **`apps/web`** sirve al **sitio público de marketing**, al **dashboard de Empresa**, y
  al **panel de Admin interno** — los tres son experiencias "de escritorio", agrupadas
  por rutas y protegidas por rol dentro de la misma app Next.js.

### Mobile: React Native + Expo (no Flutter, no nativo puro)

Se evaluó explícitamente contra Flutter. Flutter no es peor técnicamente — de hecho
tiene ventajas reales: renderiza con su propio motor (Skia/Impeller) en vez de apoyarse
en componentes nativos, lo cual da consistencia visual y animaciones más pulidas out of
the box, y su tooling está más unificado que el de RN.

Pero para este equipo específicamente, React Native + Expo gana por:

1. **Conocimiento ya invertido.** El prototipo viejo ya está en React. El equipo ya
   piensa en componentes, JSX, hooks. Aprender Dart desde cero es un costo real medido
   en semanas — un costo que no depende de si se reusa código viejo o no, depende de que
   hay que aprender un lenguaje y un paradigma de widgets distintos.
2. **Flutter Web es su punto débil real.** No es un tema de costumbre: Flutter Web
   renderiza sobre CanvasKit/canvas en vez de HTML semántico real, lo cual lo hace más
   débil para SEO — justo lo que necesita el sitio público que empresas e inversionistas
   van a buscar en Google y compartir por link.
3. **Bolsa de talento regional.** En Bolivia/LatAm hay muchos más desarrolladores
   JS/React que Flutter/Dart, lo cual importa si el equipo crece (y con empresas
   interesadas, es probable que crezca).

Se usa **Expo Router** (no React Navigation imperativo) porque replica el mismo modelo
mental que Next.js App Router: carpetas = rutas. Esto reduce el costo de cambiar de
contexto entre trabajar en la app y trabajar en la web.

### Web: Next.js (no Vite puro)

El prototipo viejo usaba Vite + React Router (SPA pura). Para esta reconstrucción se
eligió Next.js porque:
- El sitio público necesita SEO real (renderizado en servidor) — una SPA pura no indexa
  bien en buscadores.
- Los dashboards de empresa/admin se benefician de la misma base de código sin tener que
  mantener un router aparte.

### Backend: Supabase (Postgres) — todavía no conectado

Se evaluó contra Firebase. Se eligió Supabase porque:
- Es Postgres real (relacional), y lo que este producto necesita — rankings, roll-ups
  por mes, por sede, por empresa — son consultas de agregación que encajan mucho mejor
  en SQL relacional que en una base NoSQL tipo Firestore.
- Da autenticación con Row Level Security integrada, que calza exacto con el modelo de 4
  roles (ver Parte 6).
- Tiene tier gratuito generoso para esta etapa.

**Importante: todavía no existe un proyecto de Supabase real conectado.** El schema
completo ya está escrito como migraciones SQL (ver Parte 6), listo para aplicarse el día
que exista un proyecto — pero activar eso requiere crear el proyecto en supabase.com,
algo que solo el dueño de la cuenta puede hacer.

### Lenguaje, estilos, monorepo

- **TypeScript en todo** (mobile, web, paquete compartido) — con 4 roles y un schema
  compartido, los tipos evitan bugs tontos, y Supabase puede autogenerar tipos TS desde
  la base de datos el día que se conecte.
- **Tailwind CSS v4** en la web (con tokens de marca propios, no el gris genérico por
  defecto — ver Parte 8). Mobile usa `StyleSheet` de React Native directamente con la
  misma paleta en hex.
- **Turborepo** con workspaces de npm — permite correr `dev`/`build`/`typecheck` en las
  3 workspaces (`web`, `mobile`, `@verdex/shared`) desde la raíz, con cache incremental.

---

## PARTE 5 — Estructura exacta del monorepo

```
Verdex-Platform/
├── package.json              workspaces: apps/*, packages/*
├── turbo.json                tareas: build, dev, lint, typecheck
├── CLAUDE.md                 este archivo
│
├── apps/
│   ├── web/                  Next.js 16 + TypeScript + Tailwind v4
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (marketing)/     grupo de rutas público — layout con Nav+Footer
│   │       │   │   ├── page.tsx           /  (home real, con copy del pitch)
│   │       │   │   ├── empresas/          REAL — pitch B2B, planes, CTA a /contacto
│   │       │   │   ├── recicladores/      REAL — cómo validar/cobrar, tipos de punto, CTA a /contacto
│   │       │   │   ├── impacto/           REAL — impacto de toda la red vía getNetworkImpact()
│   │       │   │   ├── nosotros/          REAL — historia UPSSA→ElevateU→CAINCO (sin inventar bios no documentadas)
│   │       │   │   ├── contacto/          REAL — formulario client-side, sin backend todavía (honesto al respecto)
│   │       │   │   └── login/             /login  (UI real, sin lógica de auth aún)
│   │       │   ├── empresa/          layout con sidebar propio (RoleShell)
│   │       │   │   ├── dashboard/         REAL — el dashboard ESG completo
│   │       │   │   ├── metricas/          REAL — comparación de 2 periodos + exportar CSV
│   │       │   │   ├── facturacion/       REAL — plan, historial de facturas, método de pago (UI)
│   │       │   │   ├── equipo/            REAL — empleados afiliados + accesos al panel
│   │       │   │   └── ajustes/           REAL — datos de empresa (local), accesos, notificaciones
│   │       │   └── admin/            layout con sidebar propio (RoleShell)
│   │       │       ├── page.tsx           REAL — overview: impacto de red + alertas pendientes
│   │       │       ├── usuarios/          REAL — buscar, ver actividad, suspender/reactivar
│   │       │       ├── empresas/          REAL — aprobar/rechazar, cambiar de plan
│   │       │       ├── recicladores/      REAL — aprobar, asignar puntos de acopio
│   │       │       ├── recompensas/       REAL — crear/pausar/reactivar, ver canjes por recompensa
│   │       │       ├── pagos/             REAL — cerrar pago del periodo por reciclador + historial
│   │       │       ├── fraude/            REAL — alertas (algunas auto-generadas por createDeposit), revisar/bloquear
│   │       │       └── equipo/            REAL — invitar/quitar admins + registro de acciones (audit log)
│   │       └── components/
│   │           ├── MarketingNav.tsx, MarketingFooter.tsx
│   │           ├── RoleShell.tsx     sidebar reusable para /empresa y /admin
│   │           └── SectionStub.tsx   placeholder consistente con copy real (no lorem ipsum)
│   │
│   └── mobile/                Expo + Expo Router + TypeScript
│       └── app/
│           ├── _layout.tsx           Stack raíz + providers
│           ├── index.tsx             pantalla de entrada (elegir usuario/reciclador — temporal, sin auth aún)
│           ├── usuario/
│           │   ├── _layout.tsx       Tabs: Inicio, Escanear, Canjear, Mapa, Perfil
│           │   ├── index.tsx         REAL — home con puntos/nivel vía data-access
│           │   ├── escanear.tsx      REAL — escaneo QR del punto (+ selección manual) → material/cantidad → depósito pendiente
│           │   ├── canjear.tsx       REAL — catálogo filtrable, canje con código, historial de canjes
│           │   ├── mapa.tsx          REAL — lista filtrable por tipo (sin pines: faltan coordenadas reales)
│           │   └── perfil.tsx        REAL — identidad demo, nivel, saldo, actividad (depósitos + canjes)
│           └── reciclador/
│               ├── _layout.tsx       Tabs: Mi zona, Validar, Pagos, Perfil
│               ├── index.tsx         REAL — puntos asignados + pendientes por punto (mi zona)
│               ├── validar.tsx       REAL — lista de depósitos pendientes en la zona (+ escaneo QR) → confirmar/corregir → validar o rechazar
│               ├── pagos.tsx         REAL — periodo actual (kg/Bs calculado en vivo) + historial de cortes
│               └── perfil.tsx        REAL — datos del operador, zona asignada, stats rápidas
│
├── packages/
│   └── shared/                 @verdex/shared — sin build step, se consume como TS fuente
│       └── src/
│           ├── types/           Role, Profile, UsuarioProfile, EmpresaProfile,
│           │                    RecicladorProfile, CollectionPoint, Deposit, Reward,
│           │                    FraudFlag/AdminTeamMember/AuditLogEntry (admin.ts)...
│           ├── data/            catálogos hardcodeados (materiales, recompensas,
│           │                    niveles, puntos de acopio, dataset demo de empresa)
│           │                    — portados 1:1 desde el prototipo viejo
│           └── data-access/     LA CAPA CLAVE — ver Parte 7
│
└── supabase/
    ├── README.md               cómo aplicar las migraciones a un proyecto real
    └── migrations/             ver Parte 6 — schema completo, todavía sin aplicar
```

---

## PARTE 6 — El schema de base de datos (ya escrito, todavía no aplicado)

Vive en `supabase/migrations/`, 5 archivos, se aplican en orden. Esto NO es un diagrama
conceptual — es SQL real, listo para correr contra un proyecto de Supabase el día que
exista uno.

### `0001_profiles_and_roles.sql`
Tabla `profiles` (una fila por persona autenticada, `id` = el mismo `id` de
`auth.users` de Supabase) + una tabla de extensión por rol: `usuario_profiles`,
`empresa_profiles`, `reciclador_profiles`. Cada extensión usa el mismo `id` que
`profiles` (patrón de "herencia" por clave primaria compartida). Admin no tiene tabla
propia — `profiles.role = 'admin'` alcanza por ahora.

### `0002_catalog_and_collection_points.sql`
`materials` y `collection_points` — catálogo editable por admin, sembrado con los
mismos datos que hoy están hardcodeados en `packages/shared`, para que activar esto no
cambie los números que se ven en pantalla.

### `0003_deposits_rewards_payouts.sql`
Las tablas de actividad: `deposits` (con el campo clave `validated_by`, que referencia
al reciclador que confirmó el depósito en campo — esto es lo que le da veracidad real al
sistema), `rewards`, `redemptions`, `payouts`.

### `0004_empresa_views.sql`
Vistas de solo lectura que alimentan el dashboard de empresa:
- `empresa_deposit_facts` — una fila por depósito validado, ya unida a la empresa a la
  que cuenta, con CO₂ y agua estimados (factores de conversión aproximados, marcados
  explícitamente como placeholder a validar con datos reales de sostenibilidad).
- `empresa_monthly_kg` — kg por mes por empresa (alimenta el gráfico de tendencia).
- `empresa_ranking_by_point` — kg por punto de acopio por empresa (alimenta el ranking
  por sede).

Las tres usan `security_invoker = true`, así que respetan las políticas de RLS del
usuario que consulta, no las del dueño de la vista — importante para que la seguridad
sea real y no un bypass accidental.

**Decisión de diseño:** el período (mes/trimestre/año) NO está hardcodeado en SQL — las
vistas exponen los datos crudos por fecha, y la app filtra por rango al consultar. Esto
evita mantener tres vistas casi idénticas.

### `0005_row_level_security.sql`
Esta es la migración que hace que el modelo de 4 roles sea escalable **de verdad**, no
solo en la UI. Cada tabla tiene RLS activado con políticas específicas:
- Un usuario solo lee/escribe sus propios datos.
- Una empresa puede leer los perfiles de sus usuarios afiliados (vía
  `usuario_profiles.empresa_id`) y sus propias métricas agregadas.
- Un reciclador puede leer/validar depósitos en los puntos de acopio que tiene
  asignados.
- Admin puede todo, vía una función `is_admin()` (security definer).
- Los depósitos son **inmutables una vez creados** desde el punto de vista del usuario
  — solo el reciclador asignado o admin puede actualizarlos (para validar) — esto evita
  que un usuario edite su propio peso reportado después de enviarlo.

Sin esto, cualquiera con una API key podría leer datos de otra empresa. Con esto, la
seguridad no depende de que el frontend nunca tenga un bug.

---

## PARTE 7 — Cómo se está resolviendo lo de "dejar de estar hardcodeado"

Este es el mecanismo central para que la migración a datos reales no rompa nada cuando
llegue el momento.

En `packages/shared/src/data-access/` hay:

- **`types.ts`** — la interfaz `VerdexDataSource`. Cubre: métricas/perfil de empresa
  (`getEmpresaMetrics`, `getEmpresaProfile`, `listInvoices`, `listEmpresaAfiliados`,
  `listEmpresaTeam`...), catálogos (`listRewards`, `listCollectionPoints`,
  `listMaterials`), el flujo usuario (`getUsuarioSummary`, `createDeposit`,
  `redeemReward`, `listUsuarioActivity`...), el flujo reciclador
  (`listPendingDepositsForReciclador`, `validateDeposit`, `getRecicladorPendingPayout`...),
  impacto de red (`getNetworkImpact`) y **todo el panel admin** — usuarios, empresas,
  recicladores, recompensas, pagos, fraude y equipo interno (`listUsuarios`,
  `approveEmpresa`, `assignRecicladorZone`, `createReward`, `closePayout`,
  `resolveFraudFlag`, `inviteAdminTeamMember`, `listAuditLog`...). Son ~40 métodos en
  total — el archivo es largo a propósito, es el contrato completo que
  `SupabaseDataSource` va a tener que implementar el día que exista Supabase.
- **`mock.ts`** — una implementación de esa interfaz que hoy devuelve los mismos datos
  hardcodeados de siempre, pero ya envueltos en `Promise` — o sea, con la misma forma
  que tendría una llamada real a Supabase.
- **`index.ts`** — expone `getDataSource()` (lo que todas las pantallas deben usar) y
  `setDataSource(nuevaImplementacion)` (el interruptor que se llamará una sola vez,
  cuando exista Supabase, para cambiar de mock a real).

**Ya está probado en producción de código real, no solo diseñado:** absolutamente
todas las pantallas no-stub de `apps/web` y `apps/mobile` leen/escriben a través de
`getDataSource()`, no de los arrays directamente — eso incluye ahora los 3 paneles
completos (usuario, reciclador, empresa) más el panel admin entero. El mock
mantiene todo (depósitos, redenciones, pagos, empresas, recicladores, recompensas,
alertas de fraude, equipo admin, audit log) en memoria — misma sesión de app,
compartida entre todos los roles — y:
- `getUsuarioSummary` solo suma los depósitos que ya fueron **validados** — uno
  recién escaneado queda `pendiente` y no cuenta hasta que un reciclador lo confirma
  en campo, que es exactamente el punto del rol (Parte 3). `points` es el saldo
  gastable (baja al canjear); `totalEarned` es histórico y nunca baja — el nivel
  (Semilla → Bosque) se calcula sobre `totalEarned`, no sobre el saldo.
- `getRecicladorPendingPayout`/`listAllPendingPayouts` calculan el monto pendiente en
  vivo a partir de los depósitos validados menos lo ya pagado (`paidOutKg`); admin
  cierra el periodo con `closePayout`, que no toca `Deposit` (no diverge del schema
  SQL de Parte 6) — lleva su propio contador interno.
- `createDeposit` (la misma que usa Escanear) dispara una alerta de fraude
  automática si el peso reportado es muy alto para un depósito individual — probá
  Escanear con una cantidad grande y después mirá `/admin/fraude`.
- `getNetworkImpact` (usada por `/impacto` y el overview de admin) se escribió una
  sola vez y la consumen ambas pantallas.
- Campos de aprobación nuevos: `EmpresaProfile.status` y `RecicladorProfile.status`
  (`pendiente`/`aprobada(o)`/...) — hoy la única empresa/reciclador demo "de verdad"
  (con la que interactúan las otras pantallas) ya arranca aprobada; el resto de las
  filas sembradas en `/admin/empresas` y `/admin/recicladores` son solo para poder
  probar el flujo de aprobación.

Se verificó con `tsc --noEmit` en las 3 workspaces y levantando los servidores reales
(`next dev` para web, `expo start --web` para mobile) contra cada una de las ~30
rutas nuevas — todas devuelven 200 sin error de servidor. Falta probar el escaneo de
cámara real en un dispositivo físico con Expo Go (eso no lo puedo hacer desde acá).

**El día que exista un proyecto de Supabase real:**
1. Se agrega `@supabase/supabase-js` a `apps/web` y `apps/mobile` (no a `packages/shared`
   — ese paquete se mantiene sin dependencias de infraestructura a propósito).
2. Se escribe una clase/objeto `SupabaseDataSource` que implementa `VerdexDataSource`,
   una función a la vez (ej. `getEmpresaMetrics` pasa a ser un `select` contra la vista
   `empresa_deposit_facts` filtrado por rango de fecha).
3. Se llama `setDataSource(supabaseDataSource)` una vez, cerca de la raíz de cada app.
4. **Ninguna pantalla cambia una sola línea.**

---

## PARTE 8 — Convenciones ya establecidas (para no reinventarlas)

### Paleta de marca (ya portada del prototipo viejo, en oklch para web / hex para mobile)

| Token | Uso |
|---|---|
| `--green` / `#3E7A55` | Verde primario de marca |
| `--green-deep` / `#2C5C3D` | Verde oscuro (fondos de tarjetas hero) |
| `--green-bright` / `#5FAE7B` | Acento de progreso/barras |
| `--green-soft` / `#E3EEE0` | Fondo suave para estados activos de nav |
| `--amber` / `#C97A2E` | Acento secundario (recompensas, valor) |
| `--paper` | Fondo de tarjetas |
| `--ink` / `--ink-2` / `--ink-3` | Jerarquía de texto (oscuro → gris) |

### Tipografía
- **Serif** (Instrument Serif) — títulos, números grandes, la marca "Verdex".
- **Sans** (Geist) — texto de cuerpo.
- **Mono** (JetBrains Mono) — etiquetas pequeñas en mayúscula, cifras, "eyebrows".

### Patrón de nomenclatura de rutas
`apps/web`: segmentos reales por rol (`/empresa/*`, `/admin/*`), no grupos de rutas
paralelos que puedan chocar. `apps/mobile`: mismo patrón (`/usuario/*`,
`/reciclador/*`).

### Los "stubs" no están vacíos a propósito
Cada pantalla pendiente (`SectionStub` en web, `ScreenStub` en mobile) tiene un título,
una descripción real de qué va ahí, y una lista de lo que debe incluir — nunca lorem
ipsum, nunca una pantalla en blanco. Cualquiera que abra el proyecto entiende el alcance
sin tener que preguntar.

---

## PARTE 9 — Qué está pendiente (en orden de lo que probablemente sigue)

1. **Crear el proyecto real de Supabase** — esto lo tiene que hacer el dueño de la
   cuenta (Andrés / el equipo), no se puede hacer desde acá. Una vez creado: aplicar las
   5 migraciones (`npx supabase link` + `npx supabase db push`) y escribir
   `SupabaseDataSource`.
2. **Autenticación real** — hoy no hay login funcional en ninguna de las dos apps (el
   botón de Google en `/login` está deshabilitado a propósito, la pantalla de entrada en
   mobile es un selector manual de rol). Se conecta vía Supabase Auth una vez que exista
   el proyecto.
3. **Ya no queda ninguna pantalla stub en todo el monorepo** (ver Parte 7) —
   `apps/mobile` (usuario + reciclador) y `apps/web` (marketing, `/empresa/*`,
   `/admin/*`) están completos de punta a punta sobre el mock. `SectionStub`/
   `ScreenStub` siguen existiendo como componentes — quedan ahí para la próxima
   pantalla nueva que se agregue (ver Parte 8), no porque falte algo hoy. Lo que
   queda pendiente es auth real (punto 2) y los puntos 4-7 de abajo.
4. **Probar el escaneo QR en un dispositivo físico con Expo Go** — la lógica de
   negocio (puntos, validación) está verificada, pero el permiso de cámara y la
   captura real del QR (`apps/mobile/components/QrScanner.tsx`, vía `expo-camera`)
   todavía no se probaron en un teléfono. También falta generar/imprimir los QR
   reales de cada punto de acopio (hoy se asume el formato `verdex:point:<id>`).
5. **Coordenadas reales de los puntos de acopio** — hoy `lat`/`lng` están en `null`
   en todos los `COLLECTION_POINTS`. Mapa (usuario) hoy es una lista/filtro por eso;
   el día que haya coordenadas reales, se agrega `react-native-maps` +
   `expo-location` para el mapa con pines y "ordenar por distancia".
6. **Decisiones de negocio que hoy son placeholder en `apps/web/admin`/`apps/web/empresa`**
   — precios reales de los planes Starter/Crecimiento/Enterprise (la página
   `/empresas` describe qué incluye cada uno pero no pone un monto en Bs, a
   propósito, porque no hay una decisión de pricing documentada todavía); la
   heurística de fraude en `createDeposit` (kg > 15 o > 100 unidades equivalentes)
   es un umbral inventado para que la demo sea interactiva, no un modelo real; y
   ninguna ruta de `/admin/*` ni `/empresa/*` está todavía protegida por rol (ver
   punto 2 — se gatea junto con el resto de Supabase Auth).
7. **Rol de Aliado de canje** — evaluar si vale la pena para el alcance actual o se deja
   para después.
8. **Notificaciones push, modo offline en mobile, exportación de reportes ESG a PDF real,
   pasarela de pago real para Facturación** — todo esto queda para después de que el
   flujo core funcione de punta a punta con datos reales.

---

## Resumen de una línea, por si alguien solo lee esto

Verdex conecta usuarios, empresas y recicladores para que el reciclaje en Bolivia genere
valor real para los tres; este repo es la reconstrucción completa como monorepo
(React Native + Expo para mobile, Next.js para web, Supabase como backend pendiente de
conectar), con 4 roles ya modelados **y con toda su interfaz construida de punta a
punta** — mobile (usuario + reciclador) y web (marketing + panel empresa + panel
admin) no tienen ninguna pantalla stub restante — desde el schema SQL con RLS real
hasta una capa de datos (~40 métodos en `VerdexDataSource`) que hoy usa mocks pero ya
está lista para el cambio a producción sin tocar ni una pantalla. Lo que falta es lo
que solo el dueño de la cuenta puede hacer (crear el proyecto Supabase) y lo que
depende de eso (auth real).
