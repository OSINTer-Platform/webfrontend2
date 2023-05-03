<script lang="ts">
    import type { ArticleCategories, SearchQuery } from '$shared/types/api';

    import ListRender from '$com/article-list/header/detailList.svelte';

    export let currentItem: SearchQuery;
    export let categories: ArticleCategories;
    const dateFormatter = (date: string) => new Date(date).toLocaleDateString();

    $: params = {
        'First Date': currentItem.first_date
            ? dateFormatter(currentItem.first_date)
            : null,
        'Last Date': currentItem.last_date
            ? dateFormatter(currentItem.last_date)
            : null,

        Highlight: currentItem.search_term ? currentItem.highlight : null,

        Limit: currentItem.limit,

        'Sort Order': currentItem.sort_order,
        'Sort By': currentItem.sort_by
            ? currentItem.sort_by.replace('_', ' ')
            : 'Best Match',
    };

    $: paramStrings = Object.entries(params)
        .filter(([k, v]) => v)
        .map(([k, v]) => `${k}: ${v}`);

    $: feedSearch = currentItem.search_term
        ? `"${currentItem.search_term}"`
        : null;
    $: sources =
        currentItem.source_category.length > 0
            ? currentItem.source_category.map((v) => categories[v]?.name ?? v)
            : null;
</script>

{#if feedSearch}
    <ListRender options={{ 'Search Term': feedSearch }} mono={false} />
    <hr class="my-4 border-tertiary-700/50" />
{/if}

{#if sources}
    <ListRender options={{ Sources: sources }} mono={false} />
    <hr class="my-4 border-tertiary-700/50" />
{/if}

<ListRender options={{ 'Search Params': paramStrings }} mono={false} />
