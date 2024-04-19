<script lang="ts">
  import type { LayoutData } from "./$types";
  import type { HeaderModOptions } from "$shared/types/internal";

  import FeedRender from "$com/itemDescriptor/feed.svelte";
  import HeaderShell from "$com/itemList/header/shell.svelte";

  import { createItem } from "$lib/common/userItems";
  import { feedLocalSearch } from "$state/state";
  import { faDownload, faPlus } from "@fortawesome/free-solid-svg-icons/index";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { page } from "$app/stores";

  export let data: LayoutData;
  $: user = data.user;

  let modOptions: Array<HeaderModOptions>;

  $: modOptions = [
    ...($page.data.articles && $page.data.articles.length > 0
      ? [
          {
            title: "Download",
            icon: faDownload,
            route: `${PUBLIC_API_BASE}/articles/search/export?${data.searchUrl}`,
            options: {
              download: "true",
            },
          },
        ]
      : []),
    ...($user
      ? [
          {
            title: "Create feed",
            icon: faPlus,
            action: () => {
              createItem("New feed", data.currentSearch, "feed", "current");
            },
          },
        ]
      : []),
  ];
</script>

<HeaderShell
  title={"Custom search"}
  badge={"Search"}
  {modOptions}
  bind:searchValue={$feedLocalSearch}
>
  <FeedRender
    currentItem={data.currentSearch}
    categories={data.sourceCategories}
  />
</HeaderShell>

<slot />
