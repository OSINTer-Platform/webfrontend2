<script lang="ts">
  import Fa from "svelte-fa";
  import Large from "$com/utils/listElements/large.svelte";

  import { faStar } from "@fortawesome/free-regular-svg-icons";
  import { createItem } from "$lib/common/userItems";

  import type { Cluster, ClusterBase } from "$shared/types/api";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { page } from "$app/stores";
  import { faRectangleList } from "@fortawesome/free-solid-svg-icons";

  export let cluster: ClusterBase;

  $: user = $page.data.user;

  async function createCollection() {
    const r = await fetch(
      `${PUBLIC_API_BASE}/ml/cluster/${encodeURIComponent(cluster.id)}`
    );

    if (!r.ok) {
      console.error(
        "Error when attempting to query full cluster for collection creation"
      );
      return;
    }

    const fullCluster: Cluster = await r.json();

    createItem(
      fullCluster.title,
      fullCluster.documents,
      "collection",
      "current"
    );
  }
</script>

<hr class="border-tertiary-500 dark:border-surface-500" />

<a data-sveltekit-preload-data="off" href={`/topic/${cluster.id}`}>
  <Large
    title={{ text: cluster.title, markdown: false }}
    description={{ text: cluster.description, markdown: false }}
    leftLegend={{ text: `Nr ${cluster.nr}`, hover: "" }}
    rightLegend={{
      text: `${cluster.document_count} articles`,
      hover: "",
    }}
    tags={cluster.keywords}
    textExpands={[
      {
        title: "cluster summary",
        icon: faRectangleList,
        content: cluster.summary,
        expanded: false,
        markdown: false,
      },
    ]}
  >
    <svelte:fragment slot="icons">
      {#if $user}
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
      {/if}
    </svelte:fragment>
  </Large>
</a>
