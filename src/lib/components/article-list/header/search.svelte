<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/index';

    export let articleSearch: string = '';
</script>

<div class="w-full my-6 search-field">
    <label for="search-field">
        <Fa icon={faMagnifyingGlass} />
    </label>

    <input
        bind:value={articleSearch}
        id="search-field"
        placeholder="Search in article content"
    />
</div>
