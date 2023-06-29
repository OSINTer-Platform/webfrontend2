<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;

  import ListShell from "../listShell.svelte";
</script>

<ListShell articles={data.articles} />
