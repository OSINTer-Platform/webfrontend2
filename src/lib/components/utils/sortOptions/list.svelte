<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import type { Writable } from "svelte/store";

  import Fa from "svelte-fa";

  export let store: Writable<string>;
  export let options: {
    value: string;
    text: string;
    icon: IconDefinition;
  }[];
</script>

{#each options as { value, text, icon }}
  <li>
    <label
      tabindex="-1"
      class="
        p-2 cursor-pointer
        flex gap-2 items-center
        transition-colors drop-shadow-lg
        {$store === value
        ? 'bg-primary-500/30 hover:bg-primary-500/40'
        : 'hover:bg-primary-500/10'}
      "
    >
      <input type="radio" {value} bind:group={$store} class="hidden" />
      <Fa {icon} />
      <p class="text-nowrap">{text}</p>
    </label>
  </li>
  <hr class="border-surface-400 last:hidden" />
{/each}
