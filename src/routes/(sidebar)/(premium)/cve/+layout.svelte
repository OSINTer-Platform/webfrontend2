<script lang="ts">
  import Sidebar from "$com/sidebar/linkList.svelte";
  import Search from "$inputs/search.svelte";

  import type { SidebarOption } from "$shared/types/internal";
  import type { ClusterBase } from "$shared/types/api";

  import { readCVEs } from "$shared/state/cves";
  import { derived, writable, type Readable } from "svelte/store";
  import { searchInCVE } from "$lib/common/filter";
  import { afterNavigate } from "$app/navigation";

  const sidebarSearch = writable("");
  const filteredReadCVEs: Readable<ClusterBase[]> = derived(
    [readCVEs, sidebarSearch],
    ([$readCVEs, $sidebarSearch]) => {
      return Object.values($readCVEs).filter((c) =>
        searchInCVE(c, $sidebarSearch)
      );
    }
  );

  let option: SidebarOption;
  $: option = {
    id: "cves",
    list: $filteredReadCVEs.map((cve) => ({
      href: `/cve/${cve.id}`,
      label: cve.title,
    })),
  };

  let listContainer: HTMLElement;

  afterNavigate(() => {
    listContainer.scrollTop = 0;
  });
</script>

<Sidebar options={[option]}>
  <svelte:fragment slot="top">
    <Search
      bind:value={$sidebarSearch}
      placeholder={"Filter viewed CVEs"}
      containerClass={"m-4"}
    />
  </svelte:fragment>
</Sidebar>

<main
  bind:this={listContainer}
  class="
		flex flex-col grow items-stretch
		overflow-y-auto overflow-x-hidden scroll-smooth
		bg-surface-100 dark:bg-surface-800
	"
>
  <slot />
</main>
