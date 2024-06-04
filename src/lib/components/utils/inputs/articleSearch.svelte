<script lang="ts">
  import Search from "./search.svelte";

  export let value = "";
  export let placeholder = "";
  export let containerClass = "";
  export let inputClass = "";
  export let infoText = "";
</script>

<form action="/news/search" method="get">
  <Search
    bind:value
    {placeholder}
    {containerClass}
    {inputClass}
    inputName="search_term"
    {infoText}
  />
  <input name="highlight" value="true" type="checkbox" checked hidden />
</form>
