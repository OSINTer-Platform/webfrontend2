<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/index';

    export let articleSearch: string = '';
</script>

<div
    class="
	w-full
	my-6

	flex

	border
	border-tertiary-600

	text-black

	bg-surface-600/10
	rounded-md
"
>
    <label for="search-field" class="m-2 text-tertiary-800">
        <Fa icon={faMagnifyingGlass} />
    </label>

    <input
        bind:value={articleSearch}
        id="search-field"
        placeholder="Search in article content"
        class="
		w-full

		bg-transparent
		placeholder-tertiary-800

		p-2

		text-xs

		border-0

		focus:outline-none
		focus:border-0
	"
    />
</div>
