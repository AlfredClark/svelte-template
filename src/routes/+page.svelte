<script lang="ts">
  import { resolve } from "$app/paths";
</script>

<section class="mx-auto max-w-2xl flex-1 px-6 py-16 text-center">
  <h1 class="text-4xl font-semibold">Home</h1>
  <p class="mt-4">Minimal SvelteKit template with Tailwind CSS.</p>
  <p class="mt-4">
    <a class="underline" href={resolve("/about")}>About</a>
  </p>
</section>
