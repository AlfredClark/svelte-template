<script lang="ts">
  import { link } from "svelte-spa-router";
</script>

<section id="center">
  <div>
    <h1>About</h1>
    <p>
      This page is rendered by <code>svelte-spa-router</code> in hash mode, so it works with zero server
      configuration.
    </p>
    <p>
      <a href="#/" use:link>Back to Home</a>
    </p>
  </div>
</section>
