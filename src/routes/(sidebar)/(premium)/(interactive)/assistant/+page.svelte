<script lang="ts">
  import type { MLAssistantChat } from "$shared/types/api";

  import Loader from "$com/loader.svelte";
  import PromptList from "./promptList.svelte";
  import Searchbar from "./searchbar.svelte";

  import { handleApiResponse } from "./utils";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import TwoHalfs from "$com/utils/twohalfs.svelte";
  import PromptStats from "./promptStats.svelte";

  let initialValue = "";
  let initialRequest: null | Promise<MLAssistantChat> = null;

  let previousSearch = "";
  async function askInitial(): Promise<MLAssistantChat> {
    const r = await fetch(
      `${PUBLIC_API_BASE}/ml/inference/chat/ask` +
        `?question=${encodeURIComponent(initialValue)}`
    );

    previousSearch = initialValue;
    initialValue = "";

    return await handleApiResponse(r);
  }
</script>

<main
  class="
    flex w-full
    bg-surface-100 dark:bg-surface-800
    @container/full
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
      <TwoHalfs>
        <svelte:fragment slot="first">
          <PromptList {initialPrompts} />
        </svelte:fragment>

        <svelte:fragment slot="middle">
          <div
            class="
              @5xl:hidden
              w-full max-w-prose mx-auto
            "
          >
            <hr class="border-surface-400/25 border my-12" />
          </div>
        </svelte:fragment>

        <svelte:fragment slot="last">
          <PromptStats
            bind:newSearch={initialValue}
            articles={initialPrompts.article_base}
            on:submit={() => (initialRequest = askInitial())}
          />
        </svelte:fragment>
      </TwoHalfs>
    {/await}
  {/if}
</main>
