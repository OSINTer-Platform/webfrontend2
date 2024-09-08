<script lang="ts">
  import type { Webhook } from "$shared/types/userItems";

  import Fa from "svelte-fa";
  import FeedList from "./feedList.svelte";

  import {
    faBars,
    faCaretDown,
    faGear,
    faTrashCan,
  } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { modalState } from "$shared/state/modals";
  import { deleteItem } from "$lib/common/userItems";
  import { webhookDetails } from "$shared/config";
  import { page } from "$app/stores";

  export let webhook: Webhook;
  export let showCheckbox: boolean = false;

  const dispatch = createEventDispatcher<{ check: boolean }>();

  let hovered: boolean = false;
  let showAttachedFeeds: boolean = false;

  $: webhooks = $page.data.webhooks;

  const deleteWebhook = () =>
    modalState.append({
      modalType: "options",
      modalContent: {
        type: "error",
        title: "Delete webhook?",
        description: `Are you sure you want to delete the webhook by the name "${webhook.name}"?`,
        options: async () => {
          await deleteItem(webhook, "none");
          await webhooks.autoUpdate();
        },
      },
    });

  const updateWebhook = () =>
    modalState.append({
      modalType: "webhook",
      modalContent: {
        action: "update",
        data: {
          name: webhook.name,
          target: webhook.hook_type,
          id: webhook._id,
        },
      },
    });

  const showWebhookActions = () =>
    modalState.append({
      modalType: "actions",
      modalContent: {
        options: [
          { action: deleteWebhook, text: "Delete webhook", icon: faTrashCan },
          { action: updateWebhook, text: "Update webhook", icon: faGear },
        ],
      },
    });
</script>

<div
  on:pointerenter={() => (hovered = true)}
  on:pointerleave={() => (hovered = false)}
  class="
    flex justify-between items-center gap-4
    bg-white/5 border border-white/10 p-4
  "
>
  <main class="grow flex gap-6 items-center min-w-0">
    <div class="h-full flex justify-center items-center sm:mx-2">
      <Fa
        fw
        class="text-3xl sm:text-4xl"
        icon={webhookDetails[webhook.hook_type].icon}
      />
    </div>

    <div class="grow min-w-0">
      <h4 class="text-lg sm:text-2xl font-bold truncate">{webhook.name}</h4>
      <p class="font-light text-sm sm:text-base">
        Attached to {webhook.attached_feeds.length} feeds
      </p>
    </div>
  </main>

  <aside class="gap-4 sm:flex hidden">
    {#if hovered || showCheckbox}
      <input
        transition:slide={{ axis: "x", duration: 150 }}
        type="checkbox"
        on:change={(e) => dispatch("check", e.currentTarget.checked)}
        class="
          checkbox
          w-12 h-12 mr-2
          text-surface-50 dark:text-surface-900
          saturate-0
        "
      />
    {/if}
    {#if webhook.attached_feeds.length > 0}
      <button
        title="Show attached feeds"
        on:click={() => (showAttachedFeeds = !showAttachedFeeds)}
      >
        <Fa
          icon={faCaretDown}
          class="{showAttachedFeeds
            ? 'rotate-180'
            : ''} transition-transform duration-300"
        />
      </button>
    {/if}
    <button title="Reconfigure webhook" on:click={updateWebhook}>
      <Fa icon={faGear} />
    </button>
    <button title="Delete webhook" on:click={deleteWebhook}>
      <Fa icon={faTrashCan} />
    </button>
  </aside>

  <aside class="flex sm:hidden">
    <button on:click={showWebhookActions}>
      <Fa icon={faBars} />
    </button>
  </aside>
</div>

{#if showAttachedFeeds && webhook.attached_feeds.length > 0}
  <div
    class="bg-white/5 border border-t-0 border-white/10 p-4"
    transition:slide
  >
    <FeedList {webhook} />
  </div>
{/if}

<style lang="postcss">
  aside {
    button {
      @apply flex justify-center items-center
        h-12 aspect-square
        bg-black/20 hover:bg-black/10
        border border-white/20
        active:scale-95 transition-all;
    }
  }
</style>
