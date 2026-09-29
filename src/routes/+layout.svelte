<script lang="ts">
  import { resolve } from "$app/paths";
  import "../app.css";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
  <nav class="flex justify-center gap-4 border-b border-gray-200 p-4 dark:border-gray-800">
    <a class="no-underline hover:underline" href={resolve("/")}>Home</a>
    <a class="no-underline hover:underline" href={resolve("/about")}>About</a>
  </nav>

  <main class="flex grow flex-col">
    {@render children?.()}
  </main>
</div>
