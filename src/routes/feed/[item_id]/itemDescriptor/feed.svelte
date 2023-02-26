<script lang="ts">
    import type { ArticleCategories, Feed } from '$shared/types';
    import ListRender from './list.svelte';

    export let currentItem: Feed;
    export let categories: ArticleCategories;
    const dateFormatter = (date: string) => new Date(date).toLocaleDateString();

    const contentCreator = [
        { key: 'first_date', formatter: dateFormatter },
        { key: 'last_date', formatter: dateFormatter },

        { key: 'limit', formatter: null },

        { key: 'search_term', formatter: (param: string) => `"${param}"` },
        { key: 'highlight', formatter: null },

        {
            key: 'sort_by',
            formatter: (param: string) => param.replace('_', ' '),
        },
        { key: 'sort_order', formatter: null },
    ];

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
            : null,
    };

    $: paramStrings = Object.entries(params)
        .filter(([k, v]) => v)
        .map(([k, v]) => `${k}: ${v}`);

    $: feedSearch = currentItem.search_term
        ? `"${currentItem.search_term}"`
        : null;
    $: sources =
        currentItem.source_category.length > 0
            ? currentItem.source_category.map((v) => categories[v].name)
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
