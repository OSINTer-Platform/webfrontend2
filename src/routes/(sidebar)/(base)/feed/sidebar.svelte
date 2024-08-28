<script lang="ts">
  import SidebarShell from "$com/sidebar/components/shell.svelte";
  import AppSwitcher from "$com/sidebar/components/appSwitcher.svelte";
  import LinkNavShell from "$com/sidebar/components/linkNav/shell.svelte";
  import ItemsSection from "$com/sidebar/components/userItems/itemsSection.svelte";
  import SearchButton from "$com/sidebar/components/userItems/searchButton.svelte";

  import type { FeedItemBase, User } from "$shared/types/userItems";
  import type { SidebarOption } from "$shared/types/internal";
  import type { ArticleSearchQuery } from "$shared/types/api";

  import { goto } from "$app/navigation";
  import { modalState } from "$shared/state/modals";
  import { createItem, sanitizeQuery } from "$lib/common/userItems";

  export let feeds: FeedItemBase[];
  export let collections: FeedItemBase[];
  export let user: User | null;

  function convertToOption(
    items: Array<FeedItemBase>
  ): Array<{ href: string; label: string }> {
    return items.map((item) => ({
      href: `/feed/${item._id}`,
      label: item.name,
    }));
  }

  let feedOptions: SidebarOption;
  let collectionOptions: SidebarOption;
  $: feedOptions = {
    id: "feeds",
    title: "Your feeds",
    list: convertToOption(feeds),
  };

  $: collectionOptions = {
    id: "collections",
    title: "Your collections",
    list: convertToOption(collections),
  };

  function initiateFeedCreation() {
    if (!user) {
      goto(
        `/login?msg=${encodeURIComponent(
          "Login down below for the ability to create new feeds"
        )}`
      );
      return;
    }

    modalState.append({
      modalType: "search",
      modalContent: {
        searchText: "Create feed",
        searchAction: async (query: ArticleSearchQuery) => {
          await createItem("New Feed", sanitizeQuery(query), "feed", "current");
        },
      },
    });
  }

  const createCollection = () =>
    createItem("New Collection", [], "collection", "current");
</script>

<SidebarShell>
  <svelte:fragment slot="nav">
    <AppSwitcher />
  </svelte:fragment>

  <svelte:fragment slot="content">
    <LinkNavShell>
      <SearchButton highlight={false} />
      <ItemsSection
        options={feedOptions}
        additionButton={{ text: "Create feed", create: initiateFeedCreation }}
      />
      <ItemsSection
        options={collectionOptions}
        additionButton={{ text: "Create collection", create: createCollection }}
      />
    </LinkNavShell>
  </svelte:fragment>
</SidebarShell>
