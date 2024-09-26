<script lang="ts">
  import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
  import { faClipboard } from "@fortawesome/free-regular-svg-icons";

  import { onMount } from "svelte";
  import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { truncate } from "$lib/common/strings";

  import Fa from "svelte-fa";
  import Loader from "$com/loader.svelte";

  type QueryStatus = { success: boolean; msg: string };

  let queryStatus: Promise<QueryStatus> = Promise.resolve({
    success: false,
    msg: "Couldn't query api key",
  });

  let showEntireKey = false;

  async function queryApiKey(method: "GET" | "POST"): Promise<QueryStatus> {
    const r = await fetch(`${PUBLIC_API_BASE}/my/user/api-key`, { method });
    if (r.ok) return { success: true, msg: await r.json() };
    else return { success: false, msg: await r.json().then((r) => r.detail) };
  }

  const getApiKey = () => (queryStatus = queryApiKey("GET"));
  const regenApiKey = () => (queryStatus = queryApiKey("POST"));

  onMount(getApiKey);
</script>

<header class="flex justify-between items-center mb-3 h-12">
  <h3 class="font-bold text-lg sm:text-2xl">API key</h3>
</header>

{#await queryStatus}
  <Loader rows={1} class="h-4 w-16" />
{:then status}
  {#if status.success}
    <div
      class="
        h-12 flex justify-between items-center
        bg-black/5 dark:bg-white/5
        border border-black/10 dark:border-white/10
      "
    >
      <button
        class="aspect-square p-4"
        on:click={() => navigator.clipboard.writeText(status.msg)}
      >
        <Fa icon={faClipboard} />
      </button>
      <button
        on:click={() => (showEntireKey = !showEntireKey)}
        class="
          border-black/10 dark:border-white/10
          border-x px-4 grow flex
          text-left font-bold
          min-w-0
        "
      >
        <p class="grow text-nowrap truncate">
          {showEntireKey ? status.msg : truncate(status.msg)}
        </p>
        <Fa icon={showEntireKey ? faEye : faEyeSlash} class="text-sm ml-2" />
      </button>
      <button class="aspect-square justify-center" on:click={regenApiKey}>
        <Fa icon={faArrowRotateLeft} />
      </button>
    </div>
  {:else}
    <p class="font-bold text-error-500 text-center">
      Error when querying API key.
      <button class="underline" on:click={regenApiKey}>Try again</button>
    </p>
  {/if}
{/await}

<style lang="postcss">
  div > button {
    @apply h-full
    flex items-center
    hover:bg-black/5 dark:hover:bg-white/5
    active:scale-[98%] transition-all;
  }
</style>
