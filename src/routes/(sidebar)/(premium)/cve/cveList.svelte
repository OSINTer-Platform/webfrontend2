<script lang="ts">
  import ItemList from "$com/itemList/generic/main.svelte";

  import type { CVEBase, FullCVE } from "$shared/types/api";

  import { PUBLIC_API_BASE } from "$env/static/public";
  import { createItem } from "$lib/common/userItems";
  import { faStar } from "@fortawesome/free-regular-svg-icons";
  import { searchInCVE } from "$lib/common/filter";

  export let cves: CVEBase[];
  export let search: string;

  async function createCollection(id: string) {
    const r = await fetch(`${PUBLIC_API_BASE}/cves/search`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ ids: [id] }),
    });

    if (!r.ok) {
      console.error(
        "Error when attempting to query full CVE for collection creation"
      );
      return;
    }

    const fullCVE: FullCVE = await r.json();

    createItem(fullCVE.title, fullCVE.documents, "collection", "current");
  }

  const createListItem = (cve: CVEBase) => ({
    id: cve.id,
    href: `/cve/${cve.cve}`,

    title: { text: cve.title, markdown: false },
    description: { text: cve.description, markdown: false },

    leftLegend: { text: cve.cve, hover: "" },
    rightLegend: {
      text: `${cve.document_count} articles`,
      hover: "",
    },

    tags: cve.keywords,
    read: false,

    actions: [{ action: createCollection, icon: faStar }],
  });

  $: filteredCVEs =
    search.length > 0 ? cves.filter((cve) => searchInCVE(cve, search)) : cves;

  $: items = filteredCVEs.map((c) => createListItem(c));
</script>

<ItemList {items} />
