<script lang="ts">
  import type { HeaderModOptions } from "$shared/types/internal";
  import type { LayoutData } from "./$types";

  import HeaderShell from "$com/itemList/header/shell.svelte";

  import { feedLocalSearch } from "$state/state";
  import { faStar, faTrashCan } from "@fortawesome/free-regular-svg-icons";
  import { createItem } from "$lib/common/userItems";

  export let data: LayoutData;

  let modOptions: Array<HeaderModOptions>;

  $: user = data.user;
  $: readArticles = data.readArticles;

  $: modOptions = [
    ...($user
      ? [
          {
            title: "Create collection",
            icon: faStar,
            action: () =>
              createItem(
                "Previously read articles",
                $readArticles,
                "collection",
                "current",
                true
              ),
          },
        ]
      : []),
    {
      title: "Clear stored",
      icon: faTrashCan,
      action: () => readArticles.set([]),
    },
  ];
</script>

<HeaderShell
  title={"Previously read"}
  badge={"Inbuilt feed"}
  description={"Articles you have previously read on OSINTer. Do keep in mind that they are saved in local browser storage, so they do not transfer across devices, and clearing you cache may remove them. Create a collection if you want to save them"}
  {modOptions}
  bind:searchValue={$feedLocalSearch}
/>

<slot />
