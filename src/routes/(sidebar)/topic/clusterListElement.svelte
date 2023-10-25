<script lang="ts">
  import Fa from "svelte-fa";
  import Large from "$com/utils/listElements/large.svelte";

  import { faStar } from "@fortawesome/free-regular-svg-icons";
  import { createItem } from "$lib/common/userItems";

  import type { Cluster, ClusterBase } from "$shared/types/api";
  import { PUBLIC_API_BASE } from "$env/static/public";

  export let cluster: ClusterBase;

  async function createCollection() {
    const r = await fetch(
      `${PUBLIC_API_BASE}/ml/articles/cluster/${encodeURIComponent(cluster.id)}`
    );

    if (!r.ok) {
      console.error(
        "Error when attempting to query full cluster for collection creation"
      );
      return;
    }

    const fullCluster: Cluster = await r.json();

    createItem(fullCluster.title, fullCluster.documents, "collection", true);
  }
</script>

<hr class="text-tertiary-500 dark:text-surface-500" />

<a
  data-sveltekit-preload-data="tap"
  href={`/topic/${cluster.id}`}
  class="
    grid
    grid-cols-1
    md:grid-cols-[auto_1fr]

    gap-8

    items-center

    p-3
    sm:p-6

    hover:bg-surface-50
    dark:hover:bg-surface-500
  "
>
  <Large
    title={cluster.title}
    description={cluster.description}
    leftLegend={{ text: `Nr ${cluster.nr}`, hover: "" }}
    rightLegend={{
      text: `${cluster.document_count} articles`,
      hover: "",
    }}
    tags={cluster.keywords}
  >
    <svelte:fragment slot="actions">
      <div
        class="
        flex justify-center items-center
        h-full w-full
        bg-black/75 opacity-0
        rounded-md

        transition-opacity

        [&:focus-within>button>svg]:text-primary-500
      "
      >
        <button
          class="pb-2"
          on:click={createCollection}
          title="Create collection from cluster"
        >
          <Fa
            icon={faStar}
            class="
            hover:text-primary-500
            transition-colors
            text-white/90 text-4xl
          "
          />
        </button>
      </div>
    </svelte:fragment>
  </Large>
</a>
