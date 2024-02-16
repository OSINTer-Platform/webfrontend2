<script lang="ts">
  import type { LayoutData } from "./$types";
  import type { Collection, Feed } from "$shared/types/userItems";

  import Sidebar from "./sidebar.svelte";
  import { page } from "$app/stores";

  export let data: LayoutData;

  let feeds: Array<Feed>;
  $: feeds = data.feeds ? Object.values(data.feeds) : [];

  let collections: Array<Collection>;
  $: collections = data.collections ? Object.values(data.collections) : [];

  let search: boolean;
  $: search = $page.url.pathname.startsWith("/feed/search");

  $: user = data.user;
</script>

<Sidebar {feeds} {collections} user={$user} {search} />
<slot />
