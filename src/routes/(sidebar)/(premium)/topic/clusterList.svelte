<script lang="ts">
  import ItemList from "$com/itemList/generic/main.svelte";

  import { faStar } from "@fortawesome/free-regular-svg-icons";
  import { createItem } from "$lib/common/userItems";
  import { faRectangleList } from "@fortawesome/free-solid-svg-icons";

  import type { Cluster, ClusterBase } from "$shared/types/api";
  import { PUBLIC_API_BASE } from "$env/static/public";

  export let clusters: ClusterBase[];

  async function createCollection(id: string) {
    const r = await fetch(
      `${PUBLIC_API_BASE}/ml/cluster/${encodeURIComponent(id)}`
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

  function createListItem(cluster: ClusterBase) {
    return {
      id: cluster.id,
      href: `/topic/${cluster.id}`,

      title: { text: cluster.title, markdown: false },
      description: { text: cluster.description, markdown: false },

      leftLegend: { text: `Nr ${cluster.nr}`, hover: "" },
      rightLegend: {
        text: `${cluster.document_count} articles`,
        hover: "",
      },

      tags: cluster.keywords,
      read: false,

      textExpands: [
        {
          title: "Cluster Summary",
          icon: faRectangleList,
          content: cluster.summary,
          expanded: false,
          markdown: false,
        },
      ],

      actions: [
        {
          action: createCollection,
          icon: faStar,
          title: "Create collection from cluster",
        },
      ],
    };
  }

  $: items = clusters.map((c) => createListItem(c));
</script>

<ItemList {items} />
