<script lang="ts">
    import type { PageData } from './$types';
    import List from '$com/article-list/main.svelte';

    export let data: PageData;
</script>

<List articles={data.articles} />
