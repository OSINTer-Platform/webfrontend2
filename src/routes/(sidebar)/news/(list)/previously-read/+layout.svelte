<script lang="ts">
  import type { HeaderModOptions } from "$shared/types/internal";
  import type { LayoutData } from "./$types";

  import HeaderShell from "$com/itemList/header/shell.svelte";

  import { feedLocalSearch } from "$state/state";
  import { faStar, faTrashCan } from "@fortawesome/free-regular-svg-icons";
  import { createItem } from "$lib/common/userItems";
  import { modalState } from "$shared/state/modals";
  import { PUBLIC_API_BASE } from "$env/static/public";

  export let data: LayoutData;

  let modOptions: Array<HeaderModOptions>;

  $: user = data.user;
  $: readArticleIds = data.readArticleIds;

  $: modOptions = [
    ...($user
      ? [
          {
            title: "Create collection",
            icon: faStar,
            action: () =>
              createItem(
                "Previously read articles",
                $readArticleIds,
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
      action: () => {
        modalState.append({
          modalType: "options",
          modalContent: {
            type: "error",
            title: "Are you sure you want to clear previously read?",
            description:
              "This will completly clear you history of all articles you have ever read on OSINTer, meaning they will no longer appear under Previously Read and no longer greyed out",
            options: async () => {
              if ($user) {
                const r = await fetch(`${PUBLIC_API_BASE}/my/user/clear-read`, {
                  method: "POST",
                });

                if (r.ok) {
                  readArticleIds.set([]);
                  return true;
                } else return false;
              } else {
                readArticleIds.set([]);
                return true;
              }
            },
          },
        });
      },
    },
  ];

  $: description =
    "Articles you have previously read on OSINTer." +
    ($user
      ? ""
      : " Do keep in mind that they are saved in local browser storage, so they do not transfer across devices, and clearing you cache may remove them. Create a collection if you want to save them");
</script>

<HeaderShell
  title={"Previously read"}
  {description}
  {modOptions}
  bind:searchValue={$feedLocalSearch}
  showReadFilter={false}
/>

<slot />
