<script lang="ts">
  import Sidebar from "$com/sidebar/linkList.svelte";
  import Search from "$inputs/search.svelte";

  import type { SidebarOption } from "$shared/types/internal";

  import { filteredArticles } from "$state/storedArticles";
  import { localSearch } from "$state/storedArticles";

  let option: SidebarOption;
  $: option = {
    id: "articles",
    list: $filteredArticles.map((article) => ({
      href: `/article/${article.id}`,
      label: article.title,
    })),
  };
</script>

<Sidebar options={[option]}>
  <svelte:fragment slot="top">
    <Search
      bind:value={$localSearch}
      placeholder={"Filter saved articles"}
      containerClass={"m-4"}
    />
  </svelte:fragment>
</Sidebar>

<main
  class="
		flex
		flex-col
		grow

		items-stretch
		overflow-y-auto
		overflow-x-hidden

		bg-surface-50
		dark:bg-surface-800
		scroll-smooth
	"
>
  <slot />
</main>
