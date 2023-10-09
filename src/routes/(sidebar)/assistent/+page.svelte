<script lang="ts">
  import type { MLAssistantChat } from "$shared/types/api";

  import Loader from "$com/loader.svelte";
  import PromptList from "./promptList.svelte";
  import Searchbar from "./searchbar.svelte";

  import { handleApiResponse } from "./utils";
  import { PUBLIC_API_BASE } from "$env/static/public";

  let initialValue = "";
  let initialRequest: null | Promise<MLAssistantChat> = null;

  async function askInitial(): Promise<MLAssistantChat> {
    const r = await fetch(
      `${PUBLIC_API_BASE}/ml/inference/chat/ask` +
        `?question=${encodeURIComponent(initialValue)}`
    );

    return await handleApiResponse(r);
  }
</script>

<section
  class="
    flex flex-row w-full
    bg-surface-100 dark:bg-surface-800
"
>
  {#if !initialRequest}
    <Searchbar
      bind:value={initialValue}
      on:submit={() => (initialRequest = askInitial())}
      class="m-auto max-w-2xl"
    />
  {:else}
    {#await initialRequest}
      <Loader text="Loading AI answer" />
    {:then initialPrompts}
      <main
        class="
          max-w-2xl
          grow

          min-h-full h-fit p-8 mx-auto
          flex flex-col
      "
      >
        <PromptList {initialPrompts} />
      </main>
    {/await}
  {/if}
</section>
