<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
</script>

<section class="mx-auto max-w-2xl flex-1 px-6 py-16 text-center">
  <h1 class="text-4xl font-semibold">{page.status}</h1>
  <p class="mt-4">{page.error?.message ?? "The page you are looking for does not exist."}</p>
  <p class="mt-4">
    <a class="underline" href={resolve("/")}>Back to Home</a>
  </p>
</section>
