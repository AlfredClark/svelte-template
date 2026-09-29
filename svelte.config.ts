import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import type { Config } from "@sveltejs/kit";

const config: Config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html",
      strict: true,
    }),
    // 相对路径（Kit 2 默认为 true），保证 build/ 可部署到任意子路径，
    // 替代旧模板 vite base: "./" 的作用
    paths: {
      relative: true,
    },
  },
};

export default config;
