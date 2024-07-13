<script lang="ts">
  import ItemList from "$com/itemList/generic/main.svelte";

  import type { CVEBase, FullCVE } from "$shared/types/api";

  import { createItem } from "$lib/common/userItems";
  import { faStar } from "@fortawesome/free-regular-svg-icons";
  import { searchInCVE } from "$lib/common/filter";
  import { queryCVEsById } from "$lib/common/queryArticles";
  import { showHighlights } from "$shared/state/state";

  export let cves: CVEBase[];
  export let search: string;

  async function createCollection(id: string) {
    const cves = await queryCVEsById([id], false, true, 1);
    if (cves.length < 1) {
      console.error(
        "Error when attempting to query full CVE for collection creation"
      );
      return;
    }

    const fullCVE: FullCVE = cves[0];

    createItem(fullCVE.title, fullCVE.documents, "collection", "current");
  }

  const createListItem = (cve: CVEBase, showHighlights: boolean) => ({
    id: cve.id,
    href: `/cve/${cve.cve}`,

    title:
      cve.highlights?.title && showHighlights
        ? { text: cve.highlights.title[0], markdown: true }
        : { text: cve.title, markdown: false },
    description:
      cve.highlights?.description && showHighlights
        ? { text: cve.highlights.description[0], markdown: true }
        : { text: cve.description, markdown: false },

    leftLegend: { text: cve.cve, hover: "" },
    rightLegend: {
      text: `${cve.document_count} articles`,
      hover: "",
    },

    tags: cve.keywords,
    read: false,

    actions: [
      {
        action: createCollection,
        icon: faStar,
        title: "Create collection from CVE",
      },
    ],
  });

  $: filteredCVEs =
    search.length > 0 ? cves.filter((cve) => searchInCVE(cve, search)) : cves;

  $: items = filteredCVEs.map((c) => createListItem(c, $showHighlights));
</script>

<ItemList
  {items}
  emptyMessage={{
    title: "No CVE's was found",
    description:
      "Try adjusting your search paramaters, or contact the system administrator if you believe this is an error",
  }}
/>
