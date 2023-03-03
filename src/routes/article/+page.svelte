<script lang="ts">
    import HeaderShell from '$com/article-list/header/shell.svelte';

    import List from '$com/article-list/wrapper.svelte';
    import { fullArticles } from '$shared/state';
</script>

<HeaderShell
    title={'Stored articles'}
    description={'A list of the articles you have recently viewed in OSINTer'}
>
    <hr class="text-tertiary-600/50 sm:my-4" />
</HeaderShell>

<List articles={Object.values($fullArticles)} />
