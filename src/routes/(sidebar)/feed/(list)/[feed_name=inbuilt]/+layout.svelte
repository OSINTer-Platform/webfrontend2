<script lang="ts">
  import type { LayoutData } from "./$types";
  import type { HeaderModOptions } from "$shared/types/internal";

  import HeaderShell from "$com/article-list/header/shell.svelte";

  import { feedLocalSearch } from "$state/state";
  import { faDownload } from "@fortawesome/free-solid-svg-icons/index";
  import { page } from "$app/stores";

  export let data: LayoutData;

  let modOptions: Array<HeaderModOptions>;

  $: modOptions = [
    ...($page.data.articles && $page.data.articles.length > 0
      ? [
          {
            title: "Download",
            icon: faDownload,
            route: `${data.currentItem.url.origin}${data.currentItem.url.pathname}/export${data.currentItem.url.search}`,
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
  badge={"Inbuilt feed"}
  description={data.currentItem.desc}
  {modOptions}
  bind:searchValue={$feedLocalSearch}
/>

<slot />
