import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// SvelteKit 接管构建与别名（$lib 默认指向 src/lib），
// 静态适配器与相对路径配置见 svelte.config.ts
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
