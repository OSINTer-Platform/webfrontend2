<script lang="ts">
  import Sidebar from "$com/sidebar/linkList.svelte";
  import Search from "$inputs/search.svelte";

  import type { SidebarOption } from "$shared/types/internal";
  import type { ClusterBase } from "$shared/types/api";

  import { readClusters } from "$shared/state/topics";
  import { derived, writable, type Readable } from "svelte/store";
  import { searchInCluster } from "$lib/common/filter";

  const sidebarSearch = writable("");
  const filteredReadClusters: Readable<ClusterBase[]> = derived(
    [readClusters, sidebarSearch],
    ([$readClusters, $sidebarSearch]) => {
      return Object.values($readClusters).filter((c) =>
        searchInCluster(c, $sidebarSearch)
      );
    }
  );

  let option: SidebarOption;
  $: option = {
    id: "articles",
    list: $filteredReadClusters.map((topic) => ({
      href: `/topic/${topic.id}`,
      label: topic.title,
    })),
  };
</script>

<Sidebar options={[option]}>
  <svelte:fragment slot="top">
    <Search
      bind:value={$sidebarSearch}
      placeholder={"Filter viewed cluster"}
      containerClass={"m-4"}
    />
  </svelte:fragment>
</Sidebar>

<main
  class="
		flex
		flex-col
		grow

		items-stretch
		overflow-y-auto
		overflow-x-hidden

		bg-surface-50
		dark:bg-surface-800
		scroll-smooth
	"
>
  <slot />
</main>
