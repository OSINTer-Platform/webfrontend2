<script lang="ts">
  import type { LayoutData } from "./$types";

  import Sidebar from "./sidebar.svelte";
  import { page } from "$app/stores";

  export let data: LayoutData;

  let search: boolean;
  $: search = $page.url.pathname.startsWith("/feed/search");

  $: user = data.user;
</script>

<Sidebar user={$user} {search} />
<slot />
