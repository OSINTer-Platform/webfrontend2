<script lang="ts">
  import LinkList from "$com/sidebar/userItemsList.svelte";

  import type { ItemBase, User } from "$shared/types/userItems";
  import type { UserItemSidebarOption } from "$shared/types/internal";

  export let feeds: ItemBase[];
  export let collections: ItemBase[];
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
      id: "feeds",
      title: "Your feeds",
      list: convertToOption(feeds),
    },
    {
      id: "collections",
      title: "Your collections",
      list: convertToOption(collections),
    },
  ];
</script>

<LinkList {options} {user} {search} />
