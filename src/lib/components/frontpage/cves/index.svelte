<script lang="ts">
  import Loader from "$com/loader.svelte";
  import type { CVEBase } from "$shared/types/api";
  import Cve from "./cve.svelte";

  export let cves: CVEBase[];

  $: selectedCve = cves[0];

  let viewLimit = 2;
</script>

<div
  class="
    grid grid-cols-1 lg:grid-cols-[1fr_auto]
    w-full h-[40rem] sm:h-[60rem] lg:h-[40rem]
    bg-white/25 dark:bg-black/25
    border border-black dark:border-white/50
  "
>
  {#if selectedCve}
    <nav
      class="
      row-start-2 lg:row-start-1
      w-full lg:w-72 h-full
      border-t border-white lg:border-r lg:border-t-0 lg:border-white/25
      overflow-y-auto
    "
    >
      <ul class="flex lg:flex-col">
        {#each cves as cve, i}
          {@const selected = cve.cve === selectedCve.cve}
          {@const disabled = i + 1 > viewLimit}
          <li>
            <button
              {disabled}
              title={disabled ? "Unlock with OSINTer Pro" : ""}
              on:click={() => (selectedCve = cve)}
              class="
                h-full w-64 lg:w-full
                p-3 border-y border-white/10 text-left
                hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed
                transition-all
              "
            >
              <h4
                class:text-primary-500={selected}
                class="
                  text-lg font-bold transition-colors
                "
              >
                {cve.cve}
              </h4>
              <p class="text-sm font-light">{cve.title}</p>
            </button>
          </li>
        {/each}
      </ul>
    </nav>

    <Cve cve={selectedCve} />
  {:else}
    <Loader text="Loading CVEs" />
  {/if}
</div>
