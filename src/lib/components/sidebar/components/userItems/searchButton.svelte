<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { toUrl } from "$lib/common/searchQuery";
  import { modalState } from "$shared/state/modals";
  import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

  import Fa from "svelte-fa";

  export let highlight: boolean;

  function spawnSearchModal(e: MouseEvent) {
    const small = window.matchMedia(
      "only screen and (max-width: 60rem)"
    ).matches;
    if (small || e.ctrlKey) {
      return;
    }

    e.preventDefault();

    modalState.append({
      modalType: "search",
      modalContent: {
        query: $page.data?.currentSearch,
        searchText: "Search articles",
        searchAction: (q) => {
          goto(`/news/search?${toUrl(q)}`);
        },
      },
    });
  }
</script>

<a
  on:click={spawnSearchModal}
  href="/search"
  class="
  flex flex-row items-center
  mt-3 mb-6 mx-4 px-4 py-2
  border
  rounded-md
  text-sm sm:text-base md:text-lg

  transition-all
  duration-300

  hover:shadow-md
  hover:dark:shadow-primary-800
  hover:dark:border-primary-500/50

  {highlight
    ? 'text-primary-600 dark:text-primary-500/75 border-primary-500/50 hover:dark:text-primary-500'
    : 'text-black/30 border-surface-300 dark:border-white/25 dark:text-white/25'}
  "
>
  <Fa
    class="border-r pr-4
    {highlight
      ? 'border-primary-500/50'
      : 'border-surface-300 dark:border-white/25'}"
    icon={faMagnifyingGlass}
  />
  <span class="ml-4 uppercase font-bold">Custom search</span>
</a>
