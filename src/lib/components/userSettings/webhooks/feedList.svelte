<script lang="ts">
  import type { Feed, Webhook } from "$shared/types/userItems";

  import Loader from "$com/loader.svelte";
  import Fa from "svelte-fa";

  import { faList, faXmark } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { page } from "$app/stores";

  export let webhook: Webhook;

  $: webhooks = $page.data.webhooks;

  let feedQuery: Promise<Feed[]> = Promise.resolve([]);

  async function queryFeeds(): Promise<Feed[]> {
    const r = await fetch(
      `${PUBLIC_API_BASE}/user-items/webhook/${webhook._id}/feeds`
    );
    if (r.ok) return r.json();
    else throw "Error when querying feeds for webhook";
  }

  async function removeFeed(feed: Feed): Promise<Feed[]> {
    const url = new URL(
      `${PUBLIC_API_BASE}/user-items/webhook/${webhook._id}/feed`
    );
    url.searchParams.append("feed_id", feed._id);

    const r = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (r.ok) {
      const updatedWebhook = await r.json();

      $webhooks = $webhooks.map((w) =>
        w._id === webhook._id ? updatedWebhook : w
      );
    }

    return queryFeeds();
  }

  onMount(() => {
    feedQuery = queryFeeds();
  });
</script>

<p class="font-bold text-lg mb-2">Attached feeds</p>
{#await feedQuery}
  <Loader columns={3} rows={1} class="w-16 h-4 my-4" />
{:then feeds}
  <ul class="flex flex-col gap-2">
    {#each feeds as feed}
      <li class="flex gap-2 justify-between">
        <a
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 grow btn justify-start"
          href="/feed/{feed._id}"
        >
          <Fa icon={faList} />
          {feed.name}
        </a>
        <button
          on:click={() => (feedQuery = removeFeed(feed))}
          class="btn aspect-square"
          title="Detach webhook from feed"
        >
          <Fa icon={faXmark} />
        </button>
      </li>
    {/each}
  </ul>
{:catch err}
  <p class="text-center italic text-error-500">{err}</p>
{/await}

<style lang="postcss">
  button,
  a {
    @apply bg-black/5 dark:bg-white/5
    border border-black/10 dark:border-0;
  }
</style>
