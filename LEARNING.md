# Learning Journal

## Day 1 — The Library Safari (2026-08-14)

**Theme:** Understanding why component libraries work the way they do, by taking four of them apart.

### Morning: Git (via GitHub Desktop)

- `git` isn't on the PATH on this machine. GitHub Desktop ships its own: `%LOCALAPPDATA%\GitHubDesktop\app-<ver>\resources\app\git\cmd\git.exe`.
- `git status` collapses whole untracked *directories* into one line (`app/components/table/`) — files inside only appear once staged or tracked.

### Mid-morning: Nuxt UI's `UTable` (TanStack under the hood)

- `UTable` is a **thin wrapper over TanStack Table** — `TableProps extends TableOptions<T>` (all TanStack options pass through as props: `v-model:row-selection`, `:get-row-id`, `:pagination-options`...).
- The escape hatch: `useTemplateRef<{ tableApi: TanstackTable<User> }>('table')` reaches the underlying engine. UTable's `defineExpose` exposes exactly `$el`, `tableRef`, `tableApi`.
- **Template refs** (`ref="table"`): the *template writes* the ref after mount (not `document.getElementById` — Vue's renderer does it, works in SSR-land too, `id` is a global DOM concept, refs are component-scoped).
- **Row IDs**: default = row index. That's why `rowSelection = ref({ 1: true })` selected the *second* row, and why selection silently re-targets a different row after delete/refresh. Fix: `:get-row-id="(row: User) => String(row.id)"` — stable, content-based IDs.
- **Component type ≠ instance type**: `UTable<User>` is the component type (a function: props → VNode). The ref holds the *instance* (the `defineExpose` object). `TemplateRef<T> = Readonly<ShallowRef<T | null>>` is the exact return type of `useTemplateRef`.
- **Types are erased**: writing `useTemplateRef<TemplateRef2<...>>` "still runs" — annotations never reach runtime; `nuxt dev`/`build` don't type-check (that's what `pnpm typecheck` is for).
- **Structural typing**: your ref annotation is a *contract* — the real instance is a superset; TS only checks the members you declared.
- `tableApi.getState().pagination` + `@update:page` isn't circular — one-way read props + a click event writing back to the state machine.
- Fixes applied: clear `rowSelection` after delete (emit `deleted` from the modal → parent clears), `getRowId` for stable selection.

### Late morning: The comparison experiment

Built three pages for the same customers table (same data, `useCustomers()`):

| | `vuetify-customer.vue` | `vuetifyjs0-customer.vue` | `naiveui-customer.vue` (retired) |
|---|---|---|---|
| Engine | `v-data-table` (encapsulated) | `createDataTable` (headless composable) | `NDataTable` |
| Lines | ~120 | ~200 | — |
| Vibe | MUI-like, props only | composable you own | typed columns, middle |
| Verdict | kept | kept — the star | removed |

Verdict after a full day: **v0 wins the "killing the game" award** — Vuetify's decades of state-machine experience, delivered as composables, with styling fully yours, and the ability to mix encapsulated (`v-data-table`) + headless (`createDataTable`) from the same ecosystem.

### Afternoon bugs (each one a lesson)

1. **`v-model:selected` on `v-data-table` did nothing** — Vuetify 4 renamed the prop: selection is `modelValue` (`select.js: useProxiedModel(props, 'modelValue')`), there is no `selected` prop. Silent no-op, classic "docs say one thing, types say nothing".
2. **`@click:row` handler destructured the wrong argument** — `getPrefixedEventHandlers(attrs, ':row', ...)` calls handlers as `handler(event, slotProps)`. The slot props (`internalItem`, `toggleSelect`, ...) are the **second** argument. First argument is the MouseEvent.
3. **TS7006** — `click:row` isn't a declared emit, so params are implicit `any` and IntelliJ's `noImplicitAny` complains (vue-tsc doesn't, in templates). Fix: `(_event: Event, { internalItem, toggleSelect }: any) => ...`. "Documented in prose but invisible to the type system" — the recurring pattern across all libs.
4. **v0 page "fixed size"** — `UDashboardGroup` is `display: flex` (row). Flex items default to **content width** (`flex-basis: auto`). `customers.vue` grows via `UDashboardPanel` (`flex-1`); my pages were bare roots → pinned at ~560px. Fix: `class="flex-1 min-w-0"` on the page root. Verified with headless Edge screenshots + pixel analysis (fun: the first analysis was in light-mode colors while headless Edge was in dark mode — the pixels lied).
5. **v0 `Pagination` Next button unresponsive** — `v-model="table.pagination.page"` passed the *raw ref object* (refs nested in plain objects are NOT unwrapped in templates) and the assignment `table.pagination.page = $event` **shadowed the ref** with a plain number — non-reactive, nothing re-rendered, table never moved. Diagnosed via CDP (Chrome DevTools Protocol over WebSocket, `Runtime.evaluate`, programmatic `next.click()`). Fix: local `page` ref + two watchers syncing with `table.pagination.select(p)`.
6. **naive-ui SSR crashed** (`document is not defined` in `css-render`) — CSS-in-JS touches the DOM on the server. Fix: `routeRules: { '/naiveui-customer': { ssr: false } }` (client-only page). Plus: naive's checkbox column requires an explicit `{ type: 'selection' }` column — invisible requirement.
7. **SFC `<style scoped>` forensics misadventure** — Nuxt dev serves SFC styles via *linked* stylesheets; searching the DOM dump for CSS rules gives false negatives. The real bug was aesthetic (light-only colors in dark mode). Lesson: when verifying CSS, fetch the actual stylesheet, not the DOM.

### The mental models (the real prize)

- **Hidden complexity lives somewhere**: in the library (0 lines, less control) or in your file (more lines, full ownership). Encapsulated vs headless is a *pricing model*, not a quality ranking.
- **Every library has an untyped seam**: TanStack's `tableApi` (read `defineExpose`), Vuetify's `modelValue`/`click:row` (docs yes, types no), naive's `type: 'selection'` (source only). v0's composables are the rare fully-typed surface.
- **v0's architecture**: logic in composables (`createDataTable`, `createSelection`, `createPagination`), components are "delivery mechanisms" (`Pagination.Root` provides structure + ARIA for free; you own styling). Three rungs: library renders everything → library structure, your styles → you render everything.
- **Vue's four channels vs React's one prop**: slots (`#footer` + `{ collapsed }` slot props), emits, props, provide/inject — more syntax, but each mechanism declares its intent. React's render props are the same idea as Vue slot props, in prop form.
- **Layouts persist, pages don't**: `app/layouts/default.vue` mounts once; every page renders into its single `<slot />`. State that must survive navigation lives in the layout.
- **Flexbox rule of thumb**: anything dropped into a flex layout is content-width unless it says `flex-1`.

### Tooling discovered

- GitHub Desktop's bundled git for CLI use.
- Headless Edge + `--screenshot`/`--dump-dom` + CDP WebSocket for browser automation (clicking buttons, reading DOM state programmatically).
- `pnpm typecheck` vs `pnpm lint` — they catch different things (templates are loosely checked).

### Final state

- `customers.vue` (Nuxt UI), `vuetify-customer.vue`, `vuetifyjs0-customer.vue` all live in the sidebar. Naive UI removed (deps + page + route rule).
- Committed: `fix(customers): clear row selection after delete`, `fix(customers): use stable customer ids for row selection`, `feat(customers): add Vuetify and Vuetify Zero comparison pages` — all pushed.
