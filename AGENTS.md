# AGENTS.md — svelte-template 开发规范

> 本文件面向在本仓库中工作的 AI 智能体（及人类协作者）。
> 本仓库是以通用 Svelte 模板形式维护的，`AGENTS.md` 本身随模板分发，保持通用表述，不写入具体新项目名。
> 所有规范以本文件为准；若与口头指示冲突，以本文件为准并向用户确认。

## 0. 语言与交互规范（最高优先级，必须遵守）

1. **与用户交互一律使用简体中文**：包括但不限于需求确认、方案说明、进度汇报、提问、报错解释、PR / commit 描述摘要。
2. **代码、注释、提交信息例外**：
   - 代码标识符（变量 / 函数 / 类型 / 文件名）使用英文；
   - 代码注释优先英文，复杂业务逻辑可用中英双语，但不得只写晦涩缩写；
   - commit message 必须遵循 Conventional Commits 英文格式（见 §8），但向用户汇报时要用中文解释做了什么。
3. **面向用户的输出风格**：简洁、直接、客观，只陈述事实与结论，不做多余寒暄，不使用 emoji（用户明确要求除外）。
4. **引用代码时给出路径与行号**，格式为 `file_path:line_number`，例如 `src/routes/+page.svelte:1`。
5. **不确定时先用中文提问再动手**：需求模糊、技术选型有多种可行方案、可能破坏现有行为时，必须先提问，不得擅自假设。

## 1. 项目概览

- **定位**：基于 SvelteKit 的通用 Svelte 模板，全局预渲染、开箱即用的质量门禁与 `$lib` 别名；新项目以此为起点派生（见 §11）。
- **技术栈**：Svelte 5 + SvelteKit 2 + Vite 8 + TypeScript（`~6.0`）+ `@sveltejs/adapter-static`，包管理 `pnpm@11.25.0`，Node `>=24`。
- **构建产物**：`vite build` 输出到 `build/`（含 `404.html` fallback），`svelte.config.ts` 中 `paths.relative: true` 保证可部署到任意子路径——**不要改成绝对路径**。
- **当前状态**：模板自带最小演示：`src/routes/+page.svelte` 为纯文本落地页、`src/routes/about/+page.svelte` 为路由演示、`src/routes/+error.svelte` 为兜底页。动画库 GSAP 当前未引入，后续按需添加。

## 2. 目录结构与路径别名

```text
src/
  app.html             # HTML 壳（含 %sveltekit.head% / %sveltekit.body%），不得塞业务逻辑
  app.css              # 全局样式（仅 Tailwind 引入 + 全局基线，见 §11）
  routes/              # SvelteKit 文件路由（+layout/+page/+error）
    +layout.svelte     # 仅承载导航与 <slot/>（{@render children}），不得塞业务逻辑
    +layout.ts         # export const prerender = true，全局预渲染开关
    +page.svelte       # 模板示例：纯文本落地页，可删改
    about/+page.svelte # 模板示例：路由演示，可删
    +error.svelte      # 兜底页模式，建议保留
  lib/                 # $lib 默认指向：可复用 UI + 纯逻辑 + 打包型资源（按需创建）
static/                # 直拷静态资源（favicon.svg / icons.svg 为模板示例）
```

路径别名：统一使用 SvelteKit 默认 `$lib` → `src/lib`（`svelte.config.ts` + `.svelte-kit/tsconfig.json` 自动对齐），已弃用旧 `$routes/$components/$libs/$assets` 四别名，不得新增自定义别名替代 `$lib`。

规则：

- 跨目录引用优先使用 `$lib`，禁止 `../../../` 式长相对路径。
- 页面编排放在 `src/routes`，可复用块下沉到 `$lib/components`，无 UI 的纯逻辑下沉到 `$lib` 下对应模块（如 `utils/`、`stores/`）。
- 静态直拷资源放 `static/` 并经 `$app/paths` 的 `base` 引用；需参与打包哈希的资源才放 `src/lib/assets` 并 `import` 引用。
- 新增顶层目录前先用中文向用户说明理由。

## 3. 常用命令（pnpm）

| 用途           | 命令                                                         |
| -------------- | ------------------------------------------------------------ |
| 本地开发       | `pnpm dev`                                                   |
| 构建           | `pnpm build`                                                 |
| 预览构建产物   | `pnpm preview`                                               |
| 类型检查       | `pnpm check`（`svelte-check` + `tsc -p tsconfig.node.json`） |
| Lint           | `pnpm lint` / 修复 `pnpm lint:fix`                           |
| 格式化         | `pnpm format` / 检查 `pnpm format:check`                     |
| 生成 changelog | `pnpm changelog`                                             |

质量门禁（Husky + CI）：

- `pre-commit`：`lint-staged`（TS/Svelte 文件自动 prettier + eslint fix）；
- `commit-msg`：`commitlint` 校验；
- `pre-push`：`pnpm check`；
- CI（`.github/workflows/ci.yml`）：`format:check` → `lint` → `check` → `build`，全部通过才可合入。

智能体每次修改代码后，必须运行完整质量门禁，保证无明显质量问题：

```bash
pnpm format:check && pnpm lint && pnpm check && pnpm build
```

- 任一环节失败必须修复后重跑，直至全部通过；不得跳过失败直接汇报完成。
- 若修改仅为文档（`*.md`），至少运行 `pnpm format:check`。

## 4. 代码风格

- 遵循 `.editorconfig`：LF 换行、UTF-8、2 空格缩进、行尾无多余空格、文件末尾空行。
- Prettier（`prettier.config.ts`）：分号 `semi: true`、双引号、行宽 100、Svelte 文件用 `prettier-plugin-svelte` 解析，`prettier-plugin-tailwindcss` 负责 class 排序且必须放最后。**不要与 prettier 冲突**（ESLint 已接入 `eslint-config-prettier`）。
- ESLint（`eslint.config.ts`）：`@eslint/js` + `typescript-eslint` + `eslint-plugin-svelte` 的 recommended，不得新增全局 `eslint-disable` 压制问题；确需压制时必须写中文/英文理由注释并限定单行。
- 命名：文件 `kebab-case.svelte`（`$lib` 下组件，如 `button.svelte`）、SvelteKit 路由文件固定为 `+page.svelte` / `+layout.svelte` / `+error.svelte`、`camelCase.ts`（lib 工具）；变量/函数 `camelCase`，类型/类 `PascalCase`，常量 `UPPER_SNAKE_CASE`；CSS 类名 `kebab-case`。组件导入后的变量名保持 `PascalCase`（如 `import Button from "$lib/components/button.svelte"`）。
- 样式：组件私有样式写在 `<style>` 内；跨组件复用才放 `app.css`。避免全局选择器污染。
- Tailwind CSS v4：经 `@tailwindcss/vite` 接入，`src/app.css` 首行 `@import "tailwindcss"`；新 UI 优先用 utilities，`app.css` 只收全局基线与设计 tokens，不新增组件专属手写 CSS。暗色用 `dark:` 变体（默认 media 跟随系统，与现有 `prefers-color-scheme` 一致）。引用设计 token 时用任意值（如 `border-[var(--border)]`）。

## 5. Svelte 5 规范

1. 一律使用 **Runes 模式**：`$state` / `$derived` / `$effect` / `$props`，禁止 `export let` 等 Svelte 4 旧写法。
2. 组件结构顺序：`<script lang="ts">` → 模板 → `<style>`；`lang="ts"` 不可省略。
3. `$effect` 仅用于副作用（动画、订阅、DOM 操作），禁止在 `$effect` 内直接派生状态（用 `$derived` 代替）。
4. 动画相关副作用（如后续引入 GSAP）必须在 `$effect` 内初始化并返回清理函数（如 `ctx.revert()` / `ScrollTrigger.kill()`），防止路由切换泄漏。
5. 组件 props 用 `$props()` + TypeScript interface 显式声明类型；事件回调以 `onXxx` 回调 prop 传递（Svelte 5 风格，如 `onclick={handler}`），不要使用 Svelte 4 的 `on:click` 指令写法。

## 6. TypeScript 规范

- `strict` 生效（继承 `@tsconfig/svelte`）：禁止 `any` 透传，必要时用 `unknown` + 类型收窄；禁止隐式 `undefined` 解构而不处理。
- `.svelte` / `.js` 默认开启 `checkJs`（见 `tsconfig.app.json`），写 JS 也要保证类型检查通过。
- 公共函数必须显式标注入参与返回值类型；`$lib` 内纯函数优先、可单元测试、无副作用。
- Node 侧配置（`vite.config.ts`、`svelte.config.ts` 等）由 `tsconfig.node.json` 检查，修改后必须跑 `pnpm check`。
- 根 `tsconfig.json` 的 `disableSourceOfProjectReferenceRedirect` 不得删除：防止 eslint 解析 `.svelte` 文件时触发 TS project-reference 重定向自循环（栈溢出），详见该文件注释。

## 7. 路由规范（SvelteKit 文件路由）

- 路由表集中定义在 `src/routes` 文件系统，新增页面即新增 `+page.svelte`，`+error.svelte` 为全局兜底页。
- 页面组件只放在 `src/routes/`，文件名与路由语义对应（如 `about/+page.svelte` 对应 `/about`）。
- 路由组件懒加载优先：`import()` 动态导入，减少首屏包体积（首页除外）。

## 8. Git 与提交规范

- Conventional Commits（`commitlint.config.ts` + `cliff.toml`）：`feat|fix|docs|style|refactor|perf|test|chore` 等前缀，小写、祈使句英文，例如 `feat: add user profile page`。中文只出现在向用户的汇报里，不出现在 message 里。
- **智能体不得擅自 `commit / push / 建 PR`**，除非用户明确要求；默认由用户手动提交。每次大幅度修改完成后，智能体必须用中文汇报 + 附一条可直接使用的英文 commit message（遵循 Conventional Commits），但不得执行提交。
- 需要提供提交信息时，先 `git status` + `git diff` 自查，确认变更范围只含意图内文件，绝不提交 secrets；再给出 commit message 建议。
- Changelog 由 `git-cliff` 生成（`pnpm changelog`），手写 CHANGELOG 前先确认用户需要。

## 9. 智能体工作流约束

1. **先读后改**：调用 `edit` 前必须先 `read` 目标文件；`oldString` 取自文件原文，保持最小替换边界。
2. **优先改现文件，不随意新建文件**；新建目录/文件前先 `read` 父目录或 `glob` 确认路径正确。
3. **文件操作用专用工具**（read / edit / write / glob / grep），`bash` 只用于 git / pnpm / vite 等终端命令；读文件不用 `cat`，搜代码不用 `grep` 命令。
4. **核实优先**：完成功能、修 bug、从零写代码后，必须执行对应验证（见 §3 完整质量门禁，必要时写最小复现验证），用执行结果说话，不猜测。
5. **并行与范围**：无依赖的只读探查可并行；多步复杂任务用 TodoWrite 拆解并逐项标记，一次只做一件事。
6. **诚实汇报**：用中文汇报做了什么、怎么验证、还有何风险；发现与既有结论矛盾的证据时，以证据为准并明确指出差异。

## 10. 禁止事项

- ❌ 与用户用英文/混杂语言长篇交流（代码标识符和 commit message 除外）。
- ❌ 修改 `paths.relative` 为绝对路径；
- ❌ 引入新依赖不说明理由；引入后不同步 `pnpm-lock.yaml`。
- ❌ 提交 `build/`、`node_modules/`、本地密钥或 `.env`（注意：模板 `.gitignore` 当前仅忽略 `*.local`，新项目如需 `.env*` 自行补充，见 §11）。
- ❌ 为过检查而滥用 `eslint-disable` / `// @ts-ignore` / 关闭 CI 校验。

## 11. 以模板创建新项目时的初始化规范

本节仅在“以本仓库为模板派生新项目”时执行；日常在模板内改 bug / 加示例不走本节。

1. **先确认再动手**：用中文确认以下事项，未确认不得删示例、改名：
   - 新包名（`kebab-case`）、一句话简介、起始版本；
   - `LICENSE`：默认保留 GPLv3，换协议或闭源前必须经用户明确同意；
   - 示例删留范围：默认逐个确认，不预设全清；
   - git 历史：保留模板历史还是 `rm -rf .git && git init` 重建，由用户选。
2. **必改元信息**：
   - `package.json`：`name`、`description`、`version`（模板保持 `0.0.0`，新项目建议 `0.1.0`）、`private` 去留、`packageManager` 保持 `pnpm@11.25.0`；
   - `src/app.html`：`<html lang>` 与 `<title>` 跟新项目名对齐；
   - `README.md`：替换标题与简介，删除仅描述模板的段落；
   - `CHANGELOG.md`：若从模板带过来则删除，由新项目 `pnpm changelog` 重新生成。
3. **示例清理分级**：
   - 可删：`src/routes/+page.svelte` 落地页内容、`src/routes/about/+page.svelte`、`static/` 示例资源；
   - 保留为模式：`src/routes/+error.svelte` 兜底页；
   - `src/app.css` 模板落地页样式可裁剪，不可整文件删除导致布局裸奔；
   - 删页面后删除无用 `import`。
4. **不可动**：`svelte.config.ts` 的 `paths.relative: true` 与 `adapter-static` 全局预渲染、Husky 三钩子与 CI 四步（`format:check` → `lint` → `check` → `build`）。
5. **收尾验证**：`pnpm install` 同步 `pnpm-lock.yaml` 后跑 `pnpm format:check && pnpm lint && pnpm check && pnpm build`；新项目如需忽略 `.env*` 自行补 `.gitignore`；仍遵守 §8，不得擅自 `commit / push`。
