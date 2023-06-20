<script lang="ts">
  import Fa from "svelte-fa/src/fa.svelte";

  import AppSwitcher from "./compontents/appSwitcher.svelte";
  import LinkNavShell from "./compontents/linkNav/shell.svelte";
  import LinkNavOptions from "./compontents/linkNav/optionList.svelte";
  import SidebarShell from "./compontents/shell.svelte";

  import type { SearchQuery } from "$shared/types/api";
  import type { UserItemSidebarOption } from "$shared/types/internal";
  import type { User } from "$shared/types/userItems";

  import { modalState } from "$shared/state/state";
  import { createItem, sanitizeQuery } from "$lib/common/userItems";
  import { goto } from "$app/navigation";
  import { faPlus } from "@fortawesome/free-solid-svg-icons";

  export let options: Array<UserItemSidebarOption> = [];
  export let user: User | null;

  const categoriesWithCreation = ["feeds", "collections"];
  type categoriesWithCreation = "feeds" | "collections";

  const creationFunctions: {
    [key in categoriesWithCreation]: () => void;
  } = {
    feeds: initiateFeedCreation,
    collections: async () => {
      await createItem("New Collection", [], "collection", true);
      location.reload();
    },
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

    $modalState = {
      modalType: "search",
      modalContent: {
        query: undefined,
        searchText: "Create feed",
        searchAction: async (query: SearchQuery) => {
          await createItem("New Feed", sanitizeQuery(query), "feed", true);
          modalState.set({
            modalType: null,
            modalContent: null,
          });
          location.reload();
        },
      },
    };
  }

  function hasButton(
    id: "feeds" | "collections" | "clusters" | "inbuilts"
  ): id is categoriesWithCreation {
    return categoriesWithCreation.includes(id);
  }
</script>

<SidebarShell>
  <svelte:fragment slot="nav">
    <AppSwitcher />
  </svelte:fragment>

  <svelte:fragment slot="content">
    {#if options.length > 0}
      <LinkNavShell>
        {#each options as option}
          {#if option.list.length > 0 || (user && hasButton(option.id))}
            <LinkNavOptions options={option}>
              <svelte:fragment slot="bottom">
                {#if hasButton(option.id) && user}
                  <div class="px-4">
                    <button
                      on:click={creationFunctions[option.id]}
                      class="
											mt-2 sm:mb-6 w-full
											sm:px-4 sm:py-2 px-2 py-1

											grid grid-cols-[auto_1fr] items-center

											sm:text-base text-sm
											text-left text-black/30 dark:text-white/30

											border border-surface-400/30 sm:rounded-xl rounded-md

											hover:border-surface-400 hover:dark:text-white/80 hover:text-black/80

											transition-colors duration-300
										"
                    >
                      <Fa icon={faPlus} class="sm:mr-4 mr-2" />
                      <span
                        class="
												w-full
												sm:pl-4 pl-2

												border-l border-surface-400/30
												hover:border-surface-400

												transition-colors duration-300
											">Create new {option.id.slice(0, -1)}</span
                      >
                    </button>
                  </div>
                {/if}
              </svelte:fragment>
            </LinkNavOptions>
          {/if}
        {/each}
      </LinkNavShell>
    {/if}
  </svelte:fragment>
</SidebarShell>
