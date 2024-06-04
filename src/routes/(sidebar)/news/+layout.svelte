<script lang="ts">
  import Sidebar from "./sidebar.svelte";
  import { page } from "$app/stores";

  let search: boolean;
  $: search = $page.url.pathname.startsWith("/news/search");
</script>

<Sidebar {search} />
<slot />
