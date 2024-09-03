<script lang="ts">
  import type { WebhookTarget } from "$shared/types/userItems";

  import Modal from "./modal.svelte";
  import Select from "$inputs/select.svelte";
  import Fa from "svelte-fa";

  import {
    faCheck,
    faSpinner,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import { webhookDetails } from "$shared/config";
  import { capitalize } from "$lib/common/strings";
  import { modalState } from "$shared/state/modals";
  import { slide } from "svelte/transition";
  import { page } from "$app/stores";
  import { PUBLIC_API_BASE } from "$env/static/public";

  export let data:
    | { name?: string; target?: WebhookTarget; id: string }
    | undefined;
  export let action: "update" | "create";
  export let modalId: string;

  let actionQuery: null | Promise<void> = null;

  let target: WebhookTarget | undefined = data?.target;
  let name: string = data?.name ?? "";
  let url: string = "";

  $: webhooks = $page.data.webhooks;

  $: webhookUrlFormat = target
    ? webhookDetails[target].urlFormat
    : "https://XXXXXX.XXX/...";

  const missingField: { target: boolean; name: boolean; url: boolean } = {
    target: false,
    name: false,
    url: false,
  };

  async function submit() {
    async function query(): ReturnType<typeof fetch> {
      if (action === "create") {
        return fetch(`${PUBLIC_API_BASE}/user-items/webhook/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            webhook_name: name,
            url,
            webhook_type: target,
          }),
        });
      } else {
        return fetch(`${PUBLIC_API_BASE}/user-items/webhook/${data?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            webhook_name: name ?? null,
            url: url ?? null,
            webhook_type: target ?? url,
          }),
        });
      }
    }

    async function runQuery() {
      const r = await query();

      if (r.ok) {
        await webhooks.autoUpdate();
        setTimeout(() => modalState.remove(modalId), 500);
        return;
      } else {
        const response = await r.json();
        throw response["detail"];
      }
    }

    missingField.target = !target;
    missingField.name = !name;
    missingField.url = !url && action === "create";

    if (missingField.target || missingField.name || missingField.url) return;

    actionQuery = runQuery();
  }
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
  <h1 class="font-bold text-lg sm:text-xl md:text-2xl xl:text-3xl mb-6">
    {action === "update" ? "Update" : "Create new"} webhook
  </h1>

  <form class="flex flex-col" on:submit|stopPropagation|preventDefault={submit}>
    <main class="flex flex-col">
      <div class="flex flex-col sm:flex-row">
        <div
          class="sm:w-1/2 sm:pr-4 sm:border-r sm:border-surface-400 flex flex-col"
        >
          <p class="label">Webhook target</p>
          <Select
            on:change={() => (missingField.target = false)}
            bind:selected={target}
            placeholder="Select target"
            options={Object.values(webhookDetails).map(({ name, icon }) => ({
              value: name,
              text: capitalize(name),
              icon,
            }))}
          />
          {#if missingField.target}
            <p class="error" transition:slide>Missing webhook target</p>
          {/if}
        </div>

        <hr class="border-surface-400/50 my-4 sm:hidden" />

        <div class="grow sm:pl-4">
          <p class="label">Webhook name</p>
          <input
            on:input={() => (missingField.name = false)}
            bind:value={name}
            class="
              p-2 w-full
              bg-transparent placeholder-tertiary-800
              border focus:border border-surface-400/50
              focus:outline-none
            "
            placeholder="My new webhook"
          />
          {#if missingField.name}
            <p class="error" transition:slide>Missing webhook name</p>
          {/if}
        </div>
      </div>
    </main>

    <hr class="border-surface-400/50 my-4" />

    <div>
      <p class="label">Webhook secret (URL)</p>
      <input
        on:input={() => (missingField.url = false)}
        bind:value={url}
        class="
          p-2 w-full
          bg-transparent placeholder-tertiary-800
          border focus:border border-surface-400/50
          focus:outline-none
        "
        placeholder={webhookUrlFormat}
      />
      {#if missingField.url}
        <p class="error" transition:slide>Missing webhook url</p>
      {/if}
    </div>

    {#if actionQuery}
      {#await actionQuery}
        <div
          title="Validating webhook..."
          class="
            mt-6 p-4
            flex justify-center items-center
            bg-gray-500/10 hover:bg-gray-500/20
            border border-gray-500/50
          "
        >
          <Fa icon={faSpinner} class="animate-spin" />
        </div>
      {:then}
        <div
          class="
            mt-6 p-4
            flex justify-center items-center
            bg-success-500/10 hover:bg-success-500/20
            border border-success-500/50
          "
        >
          <Fa icon={faCheck} />
        </div>
      {:catch}
        <button
          class="btn bg-error-500/10 hover:bg-error-500/20 border border-error-500/50"
        >
          <Fa icon={faXmark} class="text-error-200 text-xl" />
        </button>
      {/await}
    {:else}
      <button
        class="btn bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/50"
      >
        {capitalize(action)} Webhook
      </button>
    {/if}

    {#if actionQuery}
      {#await actionQuery catch err}
        <p class="error text-center mt-2" transition:slide>{err}</p>
      {/await}
    {/if}
  </form>
</Modal>

<style lang="postcss">
  p {
    @apply text-sm sm:text-base;
    &.label {
      @apply mb-1;
    }
    &.error {
      @apply text-error-500 font-light;
    }
  }

  button {
    @apply mt-6 p-4;
  }
</style>
