<script lang="ts">
  import type { LayoutData } from "./$types";
  import type { HeaderModOptions } from "$shared/types/internal";

  import HeaderShell from "$com/itemList/header/shell.svelte";

  import { feedLocalSearch } from "$state/state";
  import { faDownload } from "@fortawesome/free-solid-svg-icons/index";
  import { page } from "$app/stores";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { toUrl } from "$lib/common/searchQuery";

  export let data: LayoutData;

  let modOptions: Array<HeaderModOptions>;

  $: modOptions = [
    ...($page.data.articles && $page.data.articles.length > 0
      ? [
          {
            title: "Download",
            icon: faDownload,
            route: `${PUBLIC_API_BASE}/articles/search/export?complete=false&${toUrl(
              data.currentItem.query
            )}`,
            options: {
              download: "true",
            },
          },
        ]
      : []),
  ];
</script>

<HeaderShell
  title={data.currentItem.title}
  description={data.currentItem.desc}
  {modOptions}
  bind:searchValue={$feedLocalSearch}
/>

<slot />
