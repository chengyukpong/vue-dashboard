# Vue Learning Journal

## Day 1 — The Library Safari (2026-08-14)

### What was done

- Explored the `nuxt-ui-templates/dashboard` project to learn Vue/Nuxt. Set up git via GitHub Desktop's bundled binary (`%LOCALAPPDATA%\GitHubDesktop\app-<ver>\resources\app\git\cmd\git.exe`).
- Studied the customers table (Nuxt UI's `UTable`, which is TanStack Table under the hood): row selection, `getRowId`, the `tableApi` escape hatch, deletion flow.
- Built a **comparison experiment**: three pages rendering the same customers table —
  - `vuetify-customer.vue` → Vuetify's `v-data-table` (encapsulated)
  - `vuetifyjs0-customer.vue` → Vuetify Zero's `createDataTable` (headless composable)
  - `naiveui-customer.vue` → Naive UI's `NDataTable` — **tried and retired**
- Debugged real bugs along the way: default-selection-by-index, Vuetify's `modelValue` vs `selected` rename, `@click:row` argument order, a fixed-width flexbox layout, and a `v-model` that shadowed a ref.
- **Verdict formed**: Vuetify Zero's composable engine ("state machines you own, styling you own") won the comparison.
- Committed & pushed everything.

---

### What has been learnt

#### 1. Vue's four channels of component communication

Vue gives you four distinct mechanisms for data flowing in and out of components — each with its own syntax, so the intent is visible in the code:

| Channel | Direction | Purpose | Syntax |
|---|---|---|---|
| **props** | parent → child | data in | `defineProps`, `:name="value"` |
| **emits** | child → parent | events out | `defineEmits`, `@event="handler"` |
| **slots** | parent → child | content/layout in | `<slot />`, `#name`, slot props |
| **v-model** | both | two-way binding | sugar over one prop + one emit |

- **emits** — the child never touches parent state. It *emits* an event and lets the parent decide. Example: `DeleteModal` emits `deleted`; the page does `rowSelection = {}`. ("Don't reach in; emit and let the parent react.")
- **slots** — the parent injects content into the component's holes:
  - default slot: `<slot />` (a layout's single page hole)
  - named slots: `<template #footer>` targets the `footer` slot of `UDashboardSidebar`
  - **slot props** (scoped slots): `<template #footer="{ collapsed }">` — the component hands data back *when you fill its hole*
- **provide/inject** — cross-tree state that skips prop drilling (no passing through every intermediate layer).

**React analog — "everything is a prop":**

| Vue | React |
|---|---|
| default slot | `children` |
| named slots | element props (`footer={...}`) |
| slot props | **render props** (`footer={({ collapsed }) => ...}`) |
| emits | callback props (`onClick`) |
| v-model | `value` + `onChange` (manual) |
| provide/inject | Context |

**The insight**: Vue's syntax declares intent — `#footer` *is* a hole, `@click` *is* an event, a prop *is* data. React's single pipe is uniform but ambiguous (you must read prop *names* and library conventions). The cost of Vue's clarity: more syntax to learn. "More to learn is OK when it helps simplify the complex reality."

#### 2. Vue vs React on core functionality

- **Convention over configuration**: Vue picks explicit mechanisms; React ships one mechanism and leaves the shapes to library authors.
- **Refs**: Vue's `ref()` has `.value`; template refs (`ref="table"`) are auto-bound by the renderer. React's `useRef()` returns `{ current }` and needs `forwardRef`/`useImperativeHandle`.
- **Reactivity**: Vue tracks dependencies automatically; `v-model` is two-way sugar. React re-renders on explicit state change; two-way needs manual `value`+`onChange`.
- **Lifecycle/navigation**: in Nuxt, layouts persist across navigation while pages are recreated (see §5).
- **Fair flip side**: four channels is more to learn — but each mechanism is explicit, discoverable, and typed (`emits` are declared, slots are named).

#### 3. Headless vs encapsulated libraries

- **Encapsulated** (`v-data-table`, MUI): a finished component; props configure behavior; internals hidden by design.
- **Headless** (v0, TanStack, Reka): logic/state/behavior only; **you own the markup and styling**.

**The pricing model — hidden complexity lives somewhere:**
- In the library: 0 lines, less control, magic you can't bend
- In your file: more lines, full ownership, everything inspectable

Encapsulated vs headless is a **pricing choice, not a quality ranking**. Evidence from the session: the same table was ~120 lines with `v-data-table` and ~200 with v0 — every hidden feature (thead, pagination footer, select-all checkbox) becomes your code.

**Every library has an untyped seam** — the escape hatch discoverable only via docs or source:

| Library | Seam | Discovery cost |
|---|---|---|
| TanStack (`tableApi`) | `defineExpose` surface | read source |
| Vuetify (`modelValue`, `@click:row`) | docs yes, types no | docs or source |
| Naive UI (`type: 'selection'`) | invisible requirement | source only |
| v0 composables | fully typed surface | zero — types say it all |

**Discoverability spectrum**: types say it all → documented in prose → source-only.

#### 4. Nuxt UI vs Vuetify Zero

- **Nuxt UI** = a thin skin over *third-party* engines: `UTable` passes TanStack options straight through (`TableProps extends TableOptions<T>`). To use it deeply you learn TanStack + Reka, not Nuxt UI.
- **v0** = a composable engine: `createDataTable`, `createSelection`, `createPagination` are standalone, typed state machines. Components are "delivery mechanisms" — e.g., `Pagination.Root` gives structure + ARIA for free; styling is yours.

**The three rungs of pagination (from the session):**

| | Structure | Logic | Styling |
|---|---|---|---|
| `v-data-table` | library | library | library |
| `Pagination.Root` (v0) | library | library | **yours** |
| hand-rolled footer | yours | library | yours |

**Registry + pipeline pattern** (why v0 scales to 10k rows):
- Rows live in a **non-reactive registry** — no per-row proxies
- `items` / `allItems` / `filteredItems` / `sortedItems` are computed off it
- Updates go through `upsert` or `clear()` + `onboard()` — **mutating a row in place does NOT re-run the pipeline**
- **Selection is a built-in concept** (`isAllSelected`/`isMixed` tri-state, `selectStrategy`, `itemSelectable`) — and it's also a standalone composable usable outside any table

**Mixing**: `v-data-table` for standard grids, `createDataTable` for control, composables standalone anywhere — one ecosystem, three depths.

#### 5. Vue internals that kept coming up

- **Template refs vs `id`**: refs are assigned by the renderer after mount, are component-scoped, and are SSR-safe (stays `null` on the server). `id` is a global DOM concept (CSS, anchors, `getElementById`) — you can't reach a Vue component instance from `document`.
- **`useTemplateRef`**: Vue 3.5's typed pairing of a setup ref ↔ template `ref="x"`. `TemplateRef<T> = Readonly<ShallowRef<T | null>>`.
- **Ref auto-unwrap rules**: only **top-level** template bindings and **reactive** objects unwrap refs. A ref *nested inside a plain object is NOT unwrapped* — `v-model="table.pagination.page"` passed the ref object itself, and the v-model assignment **shadowed the ref** with a plain number (non-reactive write → nothing re-rendered). This was the v0 pagination bug. Fix: a local `page` ref + two watchers syncing with `table.pagination.select(p)`.
- **Structural typing**: your type annotation is a *contract*; the real instance is a superset — extra members are fine.
- **Component type ≠ instance type**: `UTable<User>` is the component type (a function: props → VNode). The template ref holds the *instance* (`{ $el, tableRef, tableApi }` from `defineExpose`).
- **Type erasure**: annotations never reach runtime. `nuxt dev`/`build` don't type-check; `pnpm typecheck` (vue-tsc) is lenient in templates while IntelliJ is stricter (TS7006 on `@click:row`).
- **`satisfies` vs explicit annotation**: `satisfies NavigationMenuItem[][]` keeps literal types (`type: 'trigger'` stays `'trigger'`); an explicit annotation widens them.
- **`defineExpose`** is the public-instance boundary — the only thing script-setup components expose.
- **Layouts persist, pages don't**: `app/layouts/default.vue` mounts once; every page renders into its single `<slot />`; navigation swaps the slot content. State that must survive navigation lives in the layout.
- **Flexbox**: `flex-basis: auto` = content width. Anything dropped into a flex row (like a page root inside `UDashboardGroup`) needs `flex-1` — and `min-w-0` to allow shrinking. This caused the "page doesn't resize" bug.

#### 6. SSR & Nuxt integration realities

- Naive UI crashed on SSR: `css-render` touches `document` on the server → `document is not defined`. Escape hatch: `routeRules: { '/naiveui-customer': { ssr: false } }` (client-only route).
- Library setup patterns: `app/plugins/` for theme plugins (v0's `createThemePlugin`), `build.transpile` for ESM libraries.
- `nuxt dev`/`build` transpile only — type errors don't stop them. `pnpm typecheck` and `pnpm lint` are separate quality gates that catch different things.

#### 7. Vue + TypeScript gotchas

- Interfaces don't satisfy `Record<string, unknown>` (no index signature). v0's `createDataTable<T extends Record<string, unknown>>` needed the workaround: `type UserRow = User & Record<string, unknown>`, with a single `row as UserRow` assertion at `onboard`.
- IntelliJ's Vue checking applies `noImplicitAny` in template expressions (TS7006 on untyped library events) while vue-tsc's `nuxt typecheck` doesn't — both are "the typechecker", but they differ.

#### 8. Rules of thumb (the distilled checklist)

- Hidden complexity lives somewhere — encapsulated vs headless is a pricing decision, not a quality ranking.
- Never `v-model` a ref nested inside a non-reactive object (it shadows, doesn't bind).
- Anything dropped into a flex layout is content-width unless it declares `flex-1` (add `min-w-0` to allow shrink).
- Template refs are renderer-assigned and `null` on SSR.
- Verify CSS in the *linked* stylesheet, not the DOM dump (dev SFC styles are served via `<link>`).
- Check the *installed* library version — docs may describe an older line (docs said vuetify-nuxt-module 0.17; we got 1.0.0-rc.4).
- Every library has an untyped seam — know where yours hides before you need it.

#### 9. Debugging toolkit

- **Headless Edge + CDP**: `msedge --headless=new --remote-debugging-port=9222`, then drive via Chrome DevTools Protocol (`Runtime.evaluate` over WebSocket) to click buttons and read real DOM state. This is how the v0 pagination bug was actually diagnosed.
- **Pixel forensics**: measure the linked stylesheet, not the DOM dump; and check which color mode the headless browser is in (it was dark; light-mode thresholds lied).
- **Pattern**: state a hypothesis, then verify in a real browser instead of guessing.

#### 10. Library evaluation methodology

The comparison-page technique: same data, same features, multiple libraries; measure **lines of code / discoverability / SSR behavior / themability / AI-friendliness**. A reusable way to evaluate any future library — compare hands-on, never by reputation.

#### 11. AI-friendliness of stacks

- AI is fluent where training data is dense — encapsulated libraries (MUI, Vuetify) have decades of examples; headless/thin wrappers (Nuxt UI + TanStack) have thinner, version-specific docs, so AI hallucinates more.
- There's a design-for-AI trend: TanStack Charts docs state "AI should be able to compose without guessing hidden behavior"; v0 ships an official AI skill (`skills/vuetify0`).
- For learning *and* future AI-assisted work, this is a real consideration when choosing a stack.
