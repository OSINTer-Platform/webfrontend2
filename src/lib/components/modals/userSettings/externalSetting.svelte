<script lang="ts">
  import { page } from "$app/stores";
  import { PUBLIC_API_BASE } from "$env/static/public";

  import Switch from "$com/utils/inputs/switch.svelte";
  import Loader from "$com/loader.svelte";

  $: renderExternal = $page.data.settings.renderExternal;

  let request: Promise<boolean>;
  $: request = Promise.resolve($renderExternal);

  let requestProcessed = true;

  async function updateSetting(newState: boolean) {
    const r = await fetch(`${PUBLIC_API_BASE}/my/user/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ render_external: newState }),
    });

    if (r.ok) {
      renderExternal.set(newState);
      return newState;
    } else return !newState;
  }

  async function changeSetting() {
    if (!requestProcessed) return;

    requestProcessed = false;
    request = updateSetting(!$renderExternal);
    await request;
    requestProcessed = true;
  }
</script>

<section class="flex justify-between items-center gap-4 cursor-pointer">
  <button on:click={changeSetting} class="text-left">
    <h3 class="text-lg sm:text-xl font-bold">Open original article</h3>
    <p class="text-xs sm:text-sm md:text-base">
      Open articles from the original source, instead of rendering them on
      OSINTer
      <span class="text-xs sm:text-sm opacity-75">(not recommended)</span>
    </p>
  </button>

  {#await request}
    <Loader class="w-10 h-10 !gap-1" containerClass="pr-4" />
  {:then checked}
    <Switch
      containerClass="pr-4"
      size="xl"
      on:change={changeSetting}
      {checked}
    />
  {/await}
</section>
