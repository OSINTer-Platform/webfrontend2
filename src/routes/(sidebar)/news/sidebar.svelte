<script lang="ts">
  import LinkList from "$com/sidebar/userItemsList.svelte";

  import type { User } from "$shared/types/userItems";
  import type { UserItemSidebarOption } from "$shared/types/internal";

  import { inbuiltFeeds } from "$shared/config";

  export let user: User | null;
  export let search: boolean;

  let options: Array<UserItemSidebarOption>;
  $: options = [
    {
      id: "inbuilts",
      title: "Time controls",
      list: [
        ...Object.values(inbuiltFeeds).map(({ title, id }) => ({
          href: `/news/${id}`,
          label: title,
        })),
        { href: `/news/previous-month`, label: "Previous months" },
      ],
    },
  ];
</script>

<LinkList {options} {user} {search} />
