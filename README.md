# Svelte + TS + Vite

Opinionated starter for Svelte 5 + TypeScript + Vite, with hash routing,
code quality, commit conventions and path aliases preconfigured.

## Requirements

- Node.js >= 24
- pnpm >= 11 (`packageManager` is pinned; other managers will warn)

```sh
pnpm install
pnpm dev
```

## Scripts

| Script              | What it does                                               |
| ------------------- | ---------------------------------------------------------- |
| `pnpm dev`          | Start dev server                                           |
| `pnpm build`        | Production build to `dist/` (relative `base`, portable)    |
| `pnpm preview`      | Serve `dist/` locally (open this, never `dist/index.html`) |
| `pnpm check`        | `svelte-check` + `tsc` type checking                       |
| `pnpm lint`         | ESLint 10 (flat config, Svelte + TS)                       |
| `pnpm lint:fix`     | ESLint with autofix                                        |
| `pnpm format`       | Prettier write (semi, double quotes, width 100)            |
| `pnpm format:check` | Prettier check                                             |
| `pnpm changelog`    | Generate `CHANGELOG.md` via git-cliff (run before release) |

CI runs `format:check`, `lint`, `check` and `build` on every push / PR.

## Project structure

```
src/
  main.ts            # entry, mounts App
  app.svelte         # nav shell + <Router>
  app.css
  assets/            # bundled static assets (import via $assets)
  components/        # reusable UI components (import via $components)
  libs/              # shared logic / stores (import via $libs)
  routes/            # pages (import via $routes): home, about, not-found
```

## Path aliases

| Alias           | Target             | Configured in                          |
| --------------- | ------------------ | -------------------------------------- |
| `$libs/*`       | `src/libs/*`       | `vite.config.ts` + `tsconfig.app.json` |
| `$components/*` | `src/components/*` | `vite.config.ts` + `tsconfig.app.json` |
| `$assets/*`     | `src/assets/*`     | `vite.config.ts` + `tsconfig.app.json` |
| `$routes/*`     | `src/routes/*`     | `vite.config.ts` + `tsconfig.app.json` |

Vite resolves them at build time, TS paths cover `svelte-check`, the IDE
and ESLint (`projectService`). No extra ESLint config needed.

## Routing

Hash routing via [`svelte-spa-router@v5`](https://github.com/ItalyPaleAle/svelte-spa-router)
(Svelte 5 runes compatible), defined in `src/app.svelte`:

| Route     | Component                                  |
| --------- | ------------------------------------------ |
| `#/`      | `$routes/home.svelte`                      |
| `#/about` | `$routes/about.svelte`                     |
| `#/*`     | `$routes/not-found.svelte` (catch-all 404) |

To add a page: create `src/routes/foo.svelte`, register `"/foo": Foo` in the
`routes` object. Use `use:link` on internal anchors for no-refresh navigation:

```svelte
<a href="#/foo" use:link>Foo</a>
```

Hash mode is deliberate: it needs zero server configuration and stays
compatible with the portable relative-`base` `dist/`. Switch to history mode
only if you can guarantee a server fallback to `index.html`.

## Commit conventions

Commits follow [Conventional Commits](https://www.conventionalcommits.org/),
enforced by hooks (cannot be skipped without `--no-verify`, which CI ignores
anyway since CI re-runs everything):

- `pre-commit`: `lint-staged` (Prettier + ESLint on staged files only)
- `commit-msg`: `commitlint` (rejects `add lint`, accepts `feat: add lint`)
- `pre-push`: `pnpm check` (full type check)

Generate the changelog manually before a release:

```sh
pnpm changelog   # writes CHANGELOG.md, commit it separately
```

## Recommended IDE setup

VS Code + extensions (auto-prompted via `.vscode/extensions.json`):

- `svelte.svelte-vscode`
- `dbaeumer.vscode-eslint`
- `esbenp.prettier-vscode`

`.vscode/settings.json` enables format-on-save (Prettier) and ESLint autofix.
`.editorconfig` and `.gitattributes` keep indent / line-endings consistent.

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also
powered by Vite. This template is intentionally SvelteKit-free: a plain Vite
SPA with hash routing (no server-side file-based routing), structured
similarly so migration stays easy.

## Technical notes

**Why `dist/index.html` can't be opened by double-click?**

Vite builds assume an HTTP server: ES modules are blocked under `file://`.
Always inspect builds with `pnpm preview`. The relative `base: "./"` keeps
`dist/` deployable under any sub-path.

**Why HMR may not preserve local component state?**

HMR state preservation is disabled by default in both `svelte-hmr` and
`@sveltejs/vite-plugin-svelte` due to surprising behavior. Keep important
state in an external store:

```ts
// src/libs/store.ts
// An extremely simple external store
import { writable } from "svelte/store";
export default writable(0);
```
