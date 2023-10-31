<script lang="ts">
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let options: {
    [key: string]: null | undefined | string | Array<string>;
  };
  export let mono = true;

  const boxClass =
    "text-xs py-1 px-2 inline block w-fit bg-primary-500/20 border border-primary-600 rounded-md truncate dark:text-white";

  $: showAll = Object.fromEntries(
    Object.entries(options)
      .filter(([_, v]) => Array.isArray(v))
      .map(([k, _]) => [k, false])
  );
</script>

<div
  class="
	grid gap-3
  sm:grid-cols-[8rem_1fr] grid-cols-[4rem_1fr]
	overflow-hidden
"
>
  {#each Object.entries(options) as [name, value]}
    {#if value}
      <p
        class="
        border-r border-tertiary-700/30
        text-xs sm:text-base dark:text-white"
      >
        {name}:
      </p>
      {#if Array.isArray(value)}
        <div class:max-h-48={!showAll[name]} class="relative">
          <div class="h-full overflow-hidden flex flex-wrap gap-3">
            {#each value as subValue}
              <p class="{boxClass} {mono ? 'uppercase' : 'capitalize'}">
                {subValue}
              </p>
            {/each}
          </div>

          <div
            class:hidden={showAll[name]}
            class="
              absolute top-32 bottom-0 left-0 right-0
              flex items-end justify-center
              pointer-events-none
              {showAll[name]
              ? ''
              : 'bg-gradient-to-b from-transparent via-surface-200/80 to-surface-200 dark:via-surface-800/70 dark:to-surface-800'}
            "
          />

          <button
            on:click={() => (showAll[name] = !showAll[name])}
            class:rotate-180={showAll[name]}
            class="
              btn
              absolute left-1/2 -translate-x-2/3
              {showAll[name] ? 'bottom-0' : 'top-40'}
              py-2 px-20
          "
          >
            <Fa icon={faCaretDown} />
          </button>
        </div>
      {:else}
        <p class="{boxClass} {mono ? 'uppercase font-mono' : ''}">
          {value}
        </p>
      {/if}
    {/if}
  {/each}
</div>
