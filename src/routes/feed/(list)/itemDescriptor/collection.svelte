<script lang="ts">
    import type { Collection } from '$shared/types/userItems';
    import ListRender from '$com/article-list/header/detailList.svelte';

    export let currentItem: Collection;
</script>

<ListRender options={{ Contents: currentItem.ids }} />
