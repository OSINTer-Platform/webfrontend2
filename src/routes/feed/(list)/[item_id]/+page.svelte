<script lang="ts">
    import type { PageData } from './$types';
    import List from '$com/article-list/main.svelte';

    import { articleRender, localSearch } from '$shared/state';

    export let data: PageData;

    $: visibleArticles =
        $localSearch.length > 0
            ? data.articles.filter((article) =>
                  Object.values(article).some((field) =>
                      field.toLowerCase().includes($localSearch)
                  )
              )
            : data.articles;
</script>


<div
	class="
	bg-surface-100

	p-6
	sm:p-12
"
>
	<List articles={visibleArticles} layout={$articleRender} />
</div>
