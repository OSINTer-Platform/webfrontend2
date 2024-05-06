<script lang="ts">
  import { writable } from "svelte/store";

  import type { SidebarOption } from "$shared/types/internal";

  import AppSwitcher from "./compontents/appSwitcher.svelte";

  import LinkNavShell from "./compontents/linkNav/shell.svelte";
  import LinkNavOptions from "./compontents/linkNav/optionList.svelte";

  import SidebarShell from "./compontents//shell.svelte";

  import Loader from "$com/loader.svelte";
  import Search from "$com/utils/inputs/search.svelte";

  type Doc = $$Generic;

  export let docs: Promise<Doc[]> | Doc[];
  export let generateOptionLink: (doc: Doc) => { href: string; label: string };
  export let searchFilter: (doc: Doc, search: string) => boolean;
  export let type;
  export let search = writable("");

  function generateOption(docs: Doc[], search: string): SidebarOption {
    return {
      id: "link-list",
      list: Object.values(docs)
        .filter((doc) => searchFilter(doc, search))
        .map((doc) => generateOptionLink(doc)),
    };
  }
</script>

<SidebarShell>
  <svelte:fragment slot="nav">
    <AppSwitcher />
  </svelte:fragment>

  <svelte:fragment slot="content">
    <LinkNavShell>
      {#await docs}
        <Loader text="Loading previous {type}s" />
      {:then docs}
        <Search
          bind:value={$search}
          placeholder="Filter previous {type}s"
          containerClass={"m-4"}
        />
        <LinkNavOptions options={generateOption(docs, $search)} />
      {/await}
    </LinkNavShell>
  </svelte:fragment>
</SidebarShell>
