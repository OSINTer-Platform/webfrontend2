<script lang="ts">
  import SidebarShell from "$com/sidebar/components/shell.svelte";
  import AppSwitcher from "$com/sidebar/components/appSwitcher.svelte";
  import LinkNavShell from "$com/sidebar/components/linkNav/shell.svelte";
  import LinkNavOption from "$com/sidebar/components/linkNav/optionList.svelte";
  import SearchButton from "$com/sidebar/components/userItems/searchButton.svelte";

  import { inbuiltFeeds } from "$shared/config";

  import type { SidebarOption } from "$shared/types/internal";

  export let search: boolean;

  let timeOptions: SidebarOption;
  let readOptions: SidebarOption;

  $: timeOptions = {
    id: "time-inbuilts",
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

  $: readOptions = {
    id: "read-inbuilts",
    title: "Read articles",
    list: [
      { href: "/news/commonly-read", label: "Commonly Read" },
      { href: "/news/previously-read", label: "Previously Read" },
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
      <LinkNavOption options={readOptions} />
    </LinkNavShell>
  </svelte:fragment>
</SidebarShell>
