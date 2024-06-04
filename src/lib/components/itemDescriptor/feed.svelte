<script lang="ts">
  import type {
    ArticleCategories,
    ArticleSearchQuery,
  } from "$shared/types/api";
  import type { Feed } from "$shared/types/userItems";

  import { getReadableDate } from "$lib/common/math";

  import ListRender from "$com/itemList/header/detailList.svelte";

  export let currentItem: Feed | ArticleSearchQuery;
  export let categories: ArticleCategories;

  $: params = {
    "First Date": currentItem.first_date
      ? getReadableDate(currentItem.first_date)
      : null,
    "Last Date": currentItem.last_date
      ? getReadableDate(currentItem.last_date)
      : null,

    Highlight: currentItem.search_term ? currentItem.highlight : null,

    Limit: currentItem.limit,

    "Sort Order": currentItem.sort_order,
    "Sort By": currentItem.sort_by
      ? currentItem.sort_by.replace("_", " ")
      : "Best Match",
  };

  $: paramStrings = Object.entries(params)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);

  $: sources =
    currentItem.sources && currentItem.sources.length > 0
      ? currentItem.sources.map((v) => categories[v]?.name ?? v)
      : null;

  $: feedDetails = [
    "_id" in currentItem
      ? [
          { title: "ID", content: currentItem._id, mono: true },
          { title: "Owner", content: currentItem.owner, mono: true },
        ]
      : [],
    [
      { title: "Search Term", content: currentItem.search_term, mono: false },
      {
        title: "Semantic Search",
        content: currentItem.semantic_search,
        mono: false,
      },
    ],
    [{ title: "Sources", content: sources, mono: false }],
    [{ title: "Search Params", content: paramStrings, mono: false }],
  ];
</script>

<ListRender detailBatches={feedDetails} />
