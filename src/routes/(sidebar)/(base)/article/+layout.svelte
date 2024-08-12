<script lang="ts">
  import { feedLocalSearch } from "$state/state";
  import { searchInArticle } from "$lib/common/filter";
  import { page } from "$app/stores";

  import Sidebar from "$com/sidebar/linkList.svelte";

  $: readArticles = $page.data.readArticles;
</script>

<Sidebar
  docs={$readArticles}
  generateOptionLink={(a) => ({
    href: `/article/${a.id}`,
    label: a.title,
  })}
  searchFilter={(a, search) => searchInArticle(a, search)}
  search={feedLocalSearch}
  type="article"
/>

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
