<script lang="ts">
  import Sidebar from "$com/sidebar/linkList.svelte";

  import { readClusters } from "$shared/state/topics";
  import { searchInCluster } from "$lib/common/filter";
</script>

<Sidebar
  docs={Object.values($readClusters)}
  generateOptionLink={(c) => ({
    href: `/topic/${c.id}`,
    label: c.title,
  })}
  searchFilter={(c, search) => searchInCluster(c, search)}
  type="cluster"
/>

<main
  class="
		flex
		flex-col
		grow

		items-stretch
		overflow-y-auto
		overflow-x-hidden

		bg-surface-100
		dark:bg-surface-800
		scroll-smooth
	"
>
  <slot />
</main>
