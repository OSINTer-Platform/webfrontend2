<script lang="ts">
  import type { Collection } from "$shared/types/userItems";
  import ListRender from "$com/itemList/header/detailList.svelte";

  export let currentItem: Collection;
</script>

<ListRender options={{ Contents: currentItem.ids }} />
