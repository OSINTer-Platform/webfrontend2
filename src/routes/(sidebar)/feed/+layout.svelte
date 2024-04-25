<script lang="ts">
  import type { LayoutData } from "./$types";

  import { beforeNavigate } from "$app/navigation";
  import { navigating } from "$app/stores";

  import Loader from "$com/loader.svelte";
  import Sidebar from "./sidebar.svelte";

  export let data: LayoutData;

  $: user = data.user;

  let showLoader = false;

  beforeNavigate(() => {
    showLoader = false;

    setTimeout(() => (showLoader = true), 250);
  });
</script>

<Sidebar
  user={$user}
  feeds={Object.values(data.feeds)}
  collections={Object.values(data.collections)}
/>

<main
  class="
	flex
	flex-col
	grow

	items-stretch
	overflow-y-auto
	overflow-x-hidden

	bg-surface-50
	dark:bg-surface-800
"
>
  {#if $navigating && showLoader}
    <Loader text="Loading feed" />
  {:else}
    <slot />
  {/if}
</main>
