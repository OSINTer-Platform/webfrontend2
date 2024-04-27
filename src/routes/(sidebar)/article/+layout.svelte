<script lang="ts">
  import SidebarShell from "$com/sidebar/compontents/shell.svelte";
  import AppSwitcher from "$com/sidebar/compontents/appSwitcher.svelte";

  import LinkNavShell from "$com/sidebar/compontents/linkNav/shell.svelte";
  import LinkNavOptions from "$com/sidebar/compontents/linkNav/optionList.svelte";

  import type { SidebarOption } from "$shared/types/internal";

  import { feedLocalSearch } from "$state/state";
  import { searchInArticle } from "$lib/common/filter";
  import { toUrl } from "$lib/common/searchQuery";
  import { page } from "$app/stores";
  import { PUBLIC_API_BASE } from "$env/static/public";

  import type { ArticleBase } from "$shared/types/api";
  import { onMount } from "svelte";
  import Loader from "$com/loader.svelte";
  import Search from "$com/utils/inputs/search.svelte";

  $: readArticles = $page.data.readArticles;

  let articles: Promise<ArticleBase[]> = Promise.resolve([]);

  async function queryArticles(ids: string[]) {
    const r = await fetch(
      `${PUBLIC_API_BASE}/articles/search?${toUrl({ limit: 50, ids: ids })}`
    );
    return r.ok ? await r.json() : [];
  }

  function generateOption(
    articles: ArticleBase[],
    search: string
  ): SidebarOption {
    return {
      id: "articles",
      list: Object.values(articles)
        .filter((a) => searchInArticle(a, search))
        .map((article) => ({
          href: `/article/${article.id}`,
          label: article.title,
        })),
    };
  }

  onMount(() => {
    return readArticles.subscribe((ids) => (articles = queryArticles(ids)));
  });
</script>

<SidebarShell>
  <svelte:fragment slot="nav">
    <AppSwitcher />
  </svelte:fragment>

  <svelte:fragment slot="content">
    <LinkNavShell>
      {#await articles}
        <Loader text="Loading previous articles" />
      {:then articles}
        <Search
          bind:value={$feedLocalSearch}
          placeholder={"Filter previous articles"}
          containerClass={"m-4"}
        />
        <LinkNavOptions options={generateOption(articles, $feedLocalSearch)} />
      {/await}
    </LinkNavShell>
  </svelte:fragment>
</SidebarShell>

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
