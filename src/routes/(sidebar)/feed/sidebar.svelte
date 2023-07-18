<script lang="ts">
  import LinkList from "$com/sidebar/userItemsList.svelte";

  import type { ItemBase, User } from "$shared/types/userItems";
  import type { UserItemSidebarOption } from "$shared/types/internal";

  import { inbuiltFeeds } from "$shared/config";

  export let feeds: Array<ItemBase> = [];
  export let collections: Array<ItemBase> = [];
  export let clusters: Array<ItemBase> = [];
  export let user: User | null;
  export let search: boolean;

  function convertToOption(
    items: Array<ItemBase>
  ): Array<{ href: string; label: string }> {
    return items.map((item) => ({
      href: `/feed/${item._id}`,
      label: item.name,
    }));
  }

  let options: Array<UserItemSidebarOption>;
  $: options = [
    {
      id: "inbuilts",
      list: [
        ...Object.values(inbuiltFeeds).map(({ title, id }) => ({
          href: `/feed/${id}`,
          label: title,
        })),
        { href: `/feed/previous-month`, label: "Previous months" },
      ],
    },
    {
      id: "feeds",
      title: "Your feeds",
      list: convertToOption(feeds),
    },
    {
      id: "collections",
      title: "Your collections",
      list: convertToOption(collections),
    },
    {
      id: "clusters",
      title: "Current clusters",
      list: convertToOption(clusters),
    },
  ];
</script>

<LinkList {options} {user} {search} />
