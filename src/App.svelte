<script lang="ts">
  import Router, { link } from "svelte-spa-router";
  import About from "$routes/About.svelte";
  import Home from "$routes/Home.svelte";
  import NotFound from "$routes/NotFound.svelte";

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
