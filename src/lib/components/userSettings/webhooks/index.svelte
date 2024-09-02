<script lang="ts">
  import type { WebhookLimits } from "$shared/types/api";
  import type { Webhook } from "$shared/types/userItems";

  import Fa from "svelte-fa";
  import WebhookComponent from "./webhook.svelte";

  import {
    faArrowRotateLeft,
    faPlus,
    faTrashCan,
  } from "@fortawesome/free-solid-svg-icons";
  import { modalState } from "$shared/state/modals";
  import { deleteItem } from "$lib/common/userItems";
  import { invalidate } from "$app/navigation";
  import { slide } from "svelte/transition";

  export let limits: WebhookLimits;
  export let webhooks: Webhook[];

  $: webhookOptions = webhooks.map((webhook) => ({ webhook, checked: false }));
  $: canCreate = webhooks.length < limits.max_count;
  $: checkedWebhooks = webhookOptions
    .filter(({ checked }) => checked)
    .map((o) => o.webhook);

  const deleteWebhooks = () => {
    modalState.append({
      modalType: "options",
      modalContent: {
        type: "error",
        title: "Delete webhooks?",
        description: `Are you sure you want to delete ${checkedWebhooks.length} webhooks"?`,
        options: async () => {
          await Promise.all(checkedWebhooks.map((w) => deleteItem(w, "none")));
          await invalidate("data:webhook");
        },
      },
    });
    return false;
  };

  const createWebhook = () =>
    modalState.append({
      modalType: "webhook",
      modalContent: { action: "create" },
    });
</script>

<header class="flex justify-between items-center mb-2 sm:mb-6 h-12">
  <h3 class="font-bold text-lg sm:text-2xl">Webhooks</h3>
  {#if checkedWebhooks.length > 0}
    <aside>
      <button
        class="btn p-2 text-lg h-10 w-10 hover:bg-white/20 hover:dark:text-white"
        title="Clear selection"
        on:click={() =>
          (webhookOptions = webhookOptions.map(({ webhook }) => ({
            webhook,
            checked: false,
          })))}
      >
        <Fa icon={faArrowRotateLeft} />
      </button>
      <button
        class="btn p-2 text-lg h-10 w-10 hover:bg-white/20 hover:dark:text-white"
        title="Delete webhooks"
        on:click={deleteWebhooks}
      >
        <Fa icon={faTrashCan} />
      </button>
    </aside>
  {/if}
</header>

<ul class="w-full flex flex-col gap-4">
  {#each webhookOptions as option (option.webhook._id)}
    <li transition:slide>
      <WebhookComponent
        webhook={option.webhook}
        showCheckbox={checkedWebhooks.length > 0}
        on:check={(e) => (option.checked = e.detail)}
      />
    </li>
  {/each}
  <li>
    <button
      on:click={createWebhook}
      disabled={!canCreate}
      title={canCreate
        ? "Create webhook"
        : `Can not create more than ${limits.max_count} webhooks`}
      style="--height-units: {Math.max(1, 2 - webhooks.length)}"
      class="
      create-button w-full flex flex-col justify-center items-center border
      border-dashed border-surface-400/50 hover:border-surface-400
      bg-surface-400/10 hover:bg-surface-400/20 transition-all duration-300
      font-light text-sm sm:text-base
      disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Fa icon={faPlus} class="text-xl sm:text-2xl" />
      Create webhook
    </button>
  </li>
</ul>

<style>
  .create-button {
    height: calc(4.25rem * var(--height-units));

    @media (min-width: 640px) {
      height: calc(5rem * var(--height-units));
    }
  }
</style>
