<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
    import { slide } from 'svelte/transition';

    export let title: string;
    export let seperate: boolean = false;

    let open = true;

    $: seperateClass = seperate
        ? `xl:justify-between overflow-auto xl:p-2`
        : '';
</script>

<button
    type="button"
    on:click={() => (open = !open)}
    class="
	flex
	justify-between

	mb-4
	py-2
	px-4

	btn

"
>
    <h1
        class="
		font-light
		text-xl
		dark:font-bold
	"
    >
        {title}
    </h1>
    <Fa
        icon={faCaretDown}
        class="@5xl/full:hidden transition-transform {open ? '' : '-rotate-90'}"
    />
</button>

<section
    transition:slide|local
    class:seperate
    class="
flex
flex-col

min-h-0

@5xl/full:h-full
overflow-y-hidden
{open ? 'h-full' : 'h-0'}

transition-[height]
duration-700

{seperateClass}
"
>
    <slot />
</section>
