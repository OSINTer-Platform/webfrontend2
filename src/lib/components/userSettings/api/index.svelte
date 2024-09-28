<script lang="ts">
  import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
  import { faClipboard } from "@fortawesome/free-regular-svg-icons";

  import { onMount } from "svelte";
  import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { truncate } from "$lib/common/strings";

  import Fa from "svelte-fa";
  import Loader from "$com/loader.svelte";
  import { modalState } from "$shared/state/modals";

  type QueryStatus = { success: boolean; msg: string; preventCopy?: boolean };

  let queryStatus: Promise<QueryStatus> = Promise.resolve({
    success: false,
    msg: "Couldn't query api key",
  });

  let showEntireKey = false;

  async function queryApiKey(method: "GET" | "POST"): Promise<QueryStatus> {
    const r = await fetch(`${PUBLIC_API_BASE}/my/user/api-key`, { method });
    if (r.ok) {
      const response: string | null = await r.json();
      if (response) return { success: true, msg: response };
      else
        return {
          success: true,
          msg: "No API key generate yet",
          preventCopy: true,
        };
    } else return { success: false, msg: await r.json().then((r) => r.detail) };
  }

  const getApiKey = () => (queryStatus = queryApiKey("GET"));

  const visibilityChange = () => (showEntireKey = false);

  const regenApiKey = () =>
    modalState.append({
      modalType: "options",
      modalContent: {
        title: "Regenerate API key",
        description:
          "Are you sure you want to regenrate your API key? This will invalidate the old one so be careful.",
        options: () => {
          queryStatus = queryApiKey("POST");
          return;
        },
      },
    });

  onMount(() => {
    getApiKey();

    addEventListener("visibilitychange", visibilityChange);
    return () => removeEventListener("visibilitychange", visibilityChange);
  });
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
        disabled={status.preventCopy}
      >
        <Fa icon={faClipboard} />
      </button>
      <button
        disabled={status.preventCopy}
        on:click={() => (showEntireKey = !showEntireKey)}
        class="
          border-black/10 dark:border-white/10
          border-x px-4 grow flex
          text-left font-bold
          min-w-0
        "
      >
        <p class="grow text-nowrap truncate text-sm">
          {showEntireKey || status.preventCopy
            ? status.msg
            : truncate(status.msg)}
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
      <button class="underline" on:click={getApiKey}>Try again</button>
    </p>
  {/if}
{/await}

<style lang="postcss">
  div > button {
    @apply h-full
    flex items-center
    hover:bg-black/5 dark:hover:bg-white/5
    active:scale-[98%] transition-all
    disabled:active:scale-100 disabled:cursor-not-allowed;
  }
</style>
