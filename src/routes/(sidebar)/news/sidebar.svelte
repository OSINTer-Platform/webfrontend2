<script lang="ts">
  import SidebarShell from "$com/sidebar/compontents/shell.svelte";
  import AppSwitcher from "$com/sidebar/compontents/appSwitcher.svelte";
  import LinkNavShell from "$com/sidebar/compontents/linkNav/shell.svelte";
  import LinkNavOption from "$com/sidebar/compontents/linkNav/optionList.svelte";
  import SearchButton from "$com/sidebar/compontents/userItems/searchButton.svelte";

  import type { UserItemSidebarOption } from "$shared/types/internal";

  import { inbuiltFeeds } from "$shared/config";

  export let search: boolean;

  let timeOptions: UserItemSidebarOption;
  $: timeOptions = {
    id: "inbuilts",
    title: "Time controls",
    list: [
      ...inbuiltFeeds
        .filter(({ type }) => type === "timecontrol")
        .map(({ title, id }) => ({
          href: `/news/${id}`,
          label: title,
        })),
      { href: `/news/previous-month`, label: "Previous months" },
    ],
  };
</script>

<SidebarShell>
  <svelte:fragment slot="nav">
    <AppSwitcher />
  </svelte:fragment>

  <svelte:fragment slot="content">
    <LinkNavShell>
      <SearchButton highlight={search} />
      <LinkNavOption options={timeOptions} />
    </LinkNavShell>
  </svelte:fragment>
</SidebarShell>
