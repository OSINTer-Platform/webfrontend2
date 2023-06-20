<script lang="ts">
  import ListMenu from "$com/listMenu.svelte";

  import type { HeaderModOptions } from "$shared/types/internal";

  import Fa from "svelte-fa/src/fa.svelte";
  import { faBars } from "@fortawesome/free-solid-svg-icons";

  export let modOptions: Array<HeaderModOptions>;

  const btnClass = "btn p-2 text-lg aspect-square w-8";
</script>

<ListMenu listOptions={[modOptions]}>
  <button class="{btnClass} md:hidden block">
    <Fa icon={faBars} />
  </button>
</ListMenu>

<div class="md:flex hidden gap-4">
  {#each modOptions as { title, icon, route, action }}
    {#if route}
      <a href={route} {title} class={btnClass}><Fa {icon} /></a>
    {:else if action}
      <button on:click={() => action?.()} {title} class={btnClass}
        ><Fa {icon} /></button
      >
    {/if}
  {/each}
</div>
