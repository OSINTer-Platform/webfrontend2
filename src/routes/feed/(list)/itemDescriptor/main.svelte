<script lang="ts">
    import type { ItemBase, Feed, Collection } from '$shared/types/userItems';
    import type { ArticleCategories } from '$shared/types/api';

    import ListRender from './list.svelte';
    import FeedRender from './feed.svelte';
    import CollectionRender from './collection.svelte';

    export let currentItem: Feed | Collection;
    export let categories: ArticleCategories;

    $: descriptors = {
        ID: currentItem._id,
        Owner: currentItem.owner,
    };
</script>

<section class="my-6">
    <hr class="my-4 border-tertiary-700/50" />
    <ListRender options={descriptors} />
    <hr class="my-4 border-tertiary-700/50" />
    {#if currentItem.type == 'feed'}
        <FeedRender {currentItem} {categories} />
    {:else if currentItem.type == 'collection'}
        <CollectionRender {currentItem} />
    {/if}
    <hr class="mt-4 border-tertiary-700/50" />
</section>
