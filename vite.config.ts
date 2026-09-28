import { fileURLToPath, URL } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // 使用相对路径，保证 dist/ 可部署到任意子路径，
  // 且 index.html 内资源引用为 ./assets/... 而非 /assets/...
  base: "./",
  plugins: [svelte()],
  resolve: {
    alias: {
      $libs: fileURLToPath(new URL("./src/libs", import.meta.url)),
      $components: fileURLToPath(new URL("./src/components", import.meta.url)),
      $assets: fileURLToPath(new URL("./src/assets", import.meta.url)),
    },
  },
});
