<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;

  import ListShell from "../listShell.svelte";

  const emptyMessage = {
    title: "This search is empty",
    description:
      "Try changing paramaters like search terms or date range to include more articles",
  };
</script>

<ListShell articles={data.articles} {emptyMessage} />
