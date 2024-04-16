<script lang="ts">
  import type { Collection } from "$shared/types/userItems";
  import ListRender from "$com/itemList/header/detailList.svelte";

  export let currentItem: Collection;

  $: collectionDetails = [
    [
      { title: "ID", content: currentItem._id, mono: true },
      { title: "Owner", content: currentItem.owner, mono: true },
    ],
    [{ title: "Contents", content: currentItem.ids, mono: true }],
  ];
</script>

<ListRender detailBatches={collectionDetails} />
