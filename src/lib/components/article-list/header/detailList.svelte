<script lang="ts">
    export let options: {
        [key: string]: null | undefined | string | Array<string>;
    };
    export let mono = true;

    const boxClass =
        'text-xs py-1 px-2 inline block w-fit bg-primary-500/20 border border-primary-600 rounded-md truncate';
</script>

<div
    class="
	grid
	sm:grid-cols-[8rem_1fr]
	grid-cols-[4rem_1fr]
	gap-3
	overflow-hidden
"
>
    {#each Object.entries(options) as [name, value]}
        {#if value}
            <p class="border-r border-tertiary-700/30 text-xs sm:text-base">
                {name}:
            </p>
            {#if Array.isArray(value)}
                <div class="flex flex-wrap gap-2">
                    {#each value as subValue}
                        <p class="{boxClass} {mono ? 'uppercase' : 'capitalize'}">{subValue}</p>
                    {/each}
                </div>
            {:else}
                <p class="{boxClass} {mono ? 'uppercase font-mono' : ''}">
                    {value}
                </p>
            {/if}
        {/if}
    {/each}
</div>