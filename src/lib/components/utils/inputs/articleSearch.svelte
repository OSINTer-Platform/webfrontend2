<script lang="ts">
  import Search from "./search.svelte";
  import { page } from "$app/stores";

  export let value = "";
  export let placeholder = "";
  export let containerClass = "";
  export let inputClass = "";

  let inputName = $page.data.mlAvailability?.elser
    ? "semantic_search"
    : "search_term";
</script>

<form action="/feed/search" method="get">
  <Search bind:value {placeholder} {containerClass} {inputClass} {inputName} />
</form>
