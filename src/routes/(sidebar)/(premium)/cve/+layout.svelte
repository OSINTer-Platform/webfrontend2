<script lang="ts">
  import Sidebar from "$com/sidebar/linkList.svelte";

  import { readCVEs } from "$shared/state/cves";
  import { searchInCVE } from "$lib/common/filter";
  import { afterNavigate } from "$app/navigation";

  let listContainer: HTMLElement;

  afterNavigate(() => {
    listContainer.scrollTop = 0;
  });
</script>

<Sidebar
  docs={$readCVEs}
  generateOptionLink={(cve) => ({
    href: `/cve/${cve.cve}`,
    label: cve.title,
  })}
  searchFilter={(cve, search) => searchInCVE(cve, search)}
  type="CVE"
/>

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
