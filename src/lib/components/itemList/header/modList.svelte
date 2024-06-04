<script lang="ts">
  import ListMenu from "$com/listMenu.svelte";

  import type { HeaderModOptions } from "$shared/types/internal";

  import Fa from "svelte-fa";
  import { faBars } from "@fortawesome/free-solid-svg-icons";

  export let modOptions: Array<HeaderModOptions>;

  const btnClass = "btn p-2 text-lg aspect-square w-8";
</script>

{#if modOptions.length > 0}
  <ListMenu listOptions={[modOptions]}>
    <button class="{btnClass} 2xl:hidden block">
      <Fa icon={faBars} />
    </button>
  </ListMenu>

  <div class="2xl:flex hidden gap-4">
    {#each modOptions as { title, icon, route, action, options }}
      {#if route}
        <a href={route} {title} class={btnClass} {...options}><Fa {icon} /></a>
      {:else if action}
        <button
          on:click={() => action?.()}
          {title}
          class={btnClass}
          {...options}><Fa {icon} /></button
        >
      {/if}
    {/each}
  </div>
{/if}
