<script lang="ts">
  import Router, { link } from "svelte-spa-router";
  import About from "$routes/about.svelte";
  import Home from "$routes/home.svelte";
  import NotFound from "$routes/not-found.svelte";

  const routes = {
    "/": Home,
    "/about": About,
    "*": NotFound,
  };
</script>

<nav>
  <a href="#/" use:link>Home</a>
  <a href="#/about" use:link>About</a>
</nav>

<main>
  <Router {routes} />
</main>
