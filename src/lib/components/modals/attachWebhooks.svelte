<script lang="ts">
  import Modal from "./modal.svelte";
  import Search from "$com/utils/inputs/search.svelte";

  import type { Feed, Webhook } from "$shared/types/userItems";
  import Fa from "svelte-fa";
  import {
    faArrowUpRightFromSquare,
    faPlus,
  } from "@fortawesome/free-solid-svg-icons";
  import { modalState } from "$shared/state/modals";
  import { page } from "$app/stores";
  import { webhookDetails } from "$shared/config";
  import { sortWebhooks } from "$lib/common/sort";
  import { webhookSortBy } from "$shared/state/state";
  import { PUBLIC_API_BASE } from "$env/static/public";

  export let feed: Feed;

  $: webhooks = $page.data.webhooks;

  let webhookSearch = "";

  $: searchedWebhooks =
    webhookSearch.length > 0
      ? $webhooks.filter((w) =>
          w.name.toLowerCase().includes(webhookSearch.toLowerCase())
        )
      : $webhooks;

  $: sortedSearchedWebhooks = sortWebhooks(searchedWebhooks, $webhookSortBy);

  $: webhookLimits = $page.data.webhookLimits;

  $: canCreateWebhook = $webhookLimits.max_count > $webhooks.length;

  const createCollectionModal = () =>
    modalState.append({
      modalType: "webhook",
      modalContent: { action: "create" },
    });

  const handleCheckbox = async (hook: Webhook) => {
    const restMethod = hook.attached_feeds.includes(feed._id)
      ? "DELETE"
      : "PUT";

    const url = new URL(
      `${PUBLIC_API_BASE}/user-items/webhook/${hook._id}/feed`
    );
    url.searchParams.append("feed_id", feed._id);

    const r = await fetch(url, {
      method: restMethod,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (r.ok) {
      const updatedWebhook = await r.json();

      $webhooks = $webhooks.map((w) =>
        w._id === hook._id ? updatedWebhook : w
      );
    }
  };
</script>

<Modal
  class="
    p-6
    w-[40rem] max-w-[90vw]
    flex flex-col
    overflow-y-auto

    bg-surface-100 dark:bg-surface-800
  "
  style="max-height: min(90vh, 40rem)"
>
  <h1 class="font-bold text-lg sm:text-xl md:text-2xl xl:text-3xl">
    Attach webhooks
  </h1>
  <h2 class="font-light text-xs sm:text-base xl:text-lg">
    Feed: {feed.name}
  </h2>

  <hr class="border-surface-400 my-4" />

  <ul class="overflow-y-auto">
    {#each sortedSearchedWebhooks as webhook}
      {@const checked = webhook.attached_feeds.includes(feed._id)}
      {@const canToggle =
        webhook.attached_feeds.length < $webhookLimits.max_feeds_per_hook ||
        checked}
      <li class="w-full">
        <button
          on:click={() => handleCheckbox(webhook)}
          disabled={!canToggle}
          title={canToggle
            ? ""
            : `Can not attach webhook to more than ${$webhookLimits.max_feeds_per_hook} feeds`}
          id={webhook._id}
          class="
            w-full p-2 flex items-center cursor-pointer

            text-left font-light dark:font-normal
            text-sm md:text-base

            hover:bg-primary-500/10
            [&:hover>input]:bg-primary-500/20
            [&:hover>input:checked]:bg-primary-600/75
            [&:hover>div>p.opacity-0]:opacity-75
            [&:hover>a]:opacity-100

            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <input
            type="checkbox"
            {checked}
            class="w-4 checkbox mr-2"
            on:click|preventDefault
          />
          <div
            class="
            min-w-0 grow
            flex flex-nowrap items-center justify-between
          "
          >
            <p
              class="
              flex gap-1 items-center shrink-1 min-w-0
              overflow-hidden text-ellipsis"
            >
              {webhook.name}
              <span class="opacity-50 text-xs">
                | Attached to {webhook.attached_feeds.length} feeds
              </span>
            </p>
            <Fa
              fw
              icon={webhookDetails[webhook.hook_type].icon}
              class="text-lg"
            />
          </div>
        </button>
      </li>
      <hr class="border-surface-400/25 last:hidden my-2" />
    {/each}
    <li class="flex items-center">
      <button
        title={canCreateWebhook
          ? ""
          : `Can not create more than ${$webhookLimits.max_count} webhooks`}
        disabled={!canCreateWebhook}
        class="
        w-full p-2 flex items-center gap-2
        opacity-50 hover:opacity-100
        hover:bg-primary-500/5
        transition-all duration-300
        disabled:cursor-not-allowed disabled:hover:opacity-50
      "
        on:click={createCollectionModal}
      >
        <Fa icon={faPlus} />
        Create new webhook
      </button>
      <a
        on:click|stopPropagation
        title="Go to webhooks"
        class="h-10 w-10 btn shrink-0"
        href="/settings#integrations"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Fa icon={faArrowUpRightFromSquare} />
      </a>
    </li>
  </ul>

  {#if $webhooks.length > 6}
    <hr class="border-surface-400 my-4" />

    <Search
      bind:value={webhookSearch}
      placeholder={"Search in webhooks"}
      containerClass={""}
    />
  {/if}
</Modal>
