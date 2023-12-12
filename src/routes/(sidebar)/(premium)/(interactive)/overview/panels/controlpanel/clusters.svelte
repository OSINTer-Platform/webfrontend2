<script lang="ts">
  import Search from "$com/utils/inputs/search.svelte";

  import type { ClusterBase } from "$shared/types/api";

  import { searchInCluster } from "$lib/common/filter";
  import { controlParams } from "../../state";

  const { selectedClusters } = controlParams;

  export let clusters: ClusterBase[];
  let search = "";

  $: filteredClusters =
    search.length > 0
      ? clusters.filter(
          (c) => c.nr.toString() == search || searchInCluster(c, search)
        )
      : clusters;

  let selected: string[] = [];
  let hover = "";

  $: $selectedClusters = hover ? [hover, ...selected] : selected;
</script>

<div class="flex justify-between border-b-2 border-surface-400/50 mb-2 pb-2">
  <h3
    class="
        text-xl font-bold
        dark:text-white
        cursor-pointer
      "
  >
    Filter topics:
  </h3>

  <button
    class="text-xl font-light dark:text-white"
    on:click={() => {
      selected = [];
      search = "";
    }}
  >
    Clear
  </button>
</div>

<div class="overflow-auto">
  {#each filteredClusters as { id, nr, title } (id)}
    <label
      title="Topic nr {nr}"
      class="
        flex items-center p-1 gap-2
        cursor-pointer
        font-light dark:font-normal

        {selected.includes(id)
        ? 'bg-primary-500/40 hover:bg-primary-500/60'
        : 'hover:bg-primary-500/20'}
      "
      on:mouseenter={() => (hover = id)}
      on:mouseleave={() => (hover = "")}
    >
      <input
        name="cluster-selection"
        type="checkbox"
        bind:group={selected}
        value={id}
        class="hidden"
      />

      <span class="font-normal text-xs text-black/60 dark:text-white"
        >{title}</span
      >
    </label>
  {/each}
</div>

<hr class="my-2 border text-surface-400/50" />

<Search bind:value={search} placeholder="Search for topic" />
