<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

    export let listOptions: Array<
        Array<{
            text: string;
            icon: IconDefinition;
            action?: Function;
            route?: string;
        }>
    > = [];

    const buttonCss =
        'flex flex-row gap-6 hover:bg-primary-300/25 items-center justify-start rounded-xl w-full p-3 pl-5 dark:text-white dark:hover:bg-primary-500/40';
</script>

<div
    class="
	relative

	[&:focus-within>div]:block
"
>
    <slot />

    <div
        class="
		hidden
		absolute

		top-12
		right-0

		bg-surface-100
		dark:bg-surface-800

		rounded-xl

		border-tertiary-500
		border

		w-64

		shadow-xl
	"
    >
        <nav class="divide-y divide-tertiary-500 py-2 px-4">
            {#each listOptions as list}
                <ul class="py-3">
                    {#each list as option}
                        <li class="w-full text-left">
                            {#if option.route}
                                <a href={option.route} class={buttonCss}>
                                    <Fa icon={option.icon} />
                                    {option.text}
                                </a>
                            {:else if option.action}
                                <button
                                    on:click={option.action}
                                    class={buttonCss}
                                >
                                    <Fa icon={option.icon} />
                                    {option.text}
                                </button>
                            {/if}
                        </li>
                    {/each}
                </ul>
            {/each}
        </nav>
    </div>
</div>
