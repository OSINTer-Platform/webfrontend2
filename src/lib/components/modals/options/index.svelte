<script lang="ts">
  import Button from "./button.svelte";
  import Modal from "../modal.svelte";
  import SvelteMarkdown from "svelte-markdown";
  import Fa from "svelte-fa";

  import {
    faCircleCheck,
    faCircleExclamation,
    faInfoCircle,
    faTriangleExclamation,
  } from "@fortawesome/free-solid-svg-icons";
  import { modalState } from "$shared/state/modals";

  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  type ModalType = "info" | "success" | "warning" | "error";

  export let title: string;
  export let description: string;
  export let type: ModalType;
  export let modalId: string;

  export let options:
    | {
        text: string;
        type: "primary" | "secondary" | "yes" | "no" | "cancel";
        action: () => void;
      }[]
    | (() => void);

  const modalIcons: { [key in ModalType]: IconDefinition } = {
    info: faInfoCircle,
    warning: faCircleExclamation,
    error: faTriangleExclamation,
    success: faCircleCheck,
  };
</script>

<Modal
  class="
    p-6
    w-[30rem] md:w-[40rem] max-w-[90vw]
    flex flex-col
    overflow-y-auto

    bg-surface-100 dark:bg-surface-800
  "
  style="max-height: min(90vh, 40rem)"
>
  <main class="flex flex-col">
    <section class="flex grow items-center">
      <Fa
        icon={modalIcons[type]}
        class="
          text-4xl lg:text-5xl xl:text-6xl
          mt-1 ml-4
          mr-6 lg:mr-8 xl:mr-10
          {type === 'error' ? 'text-primary-600/50' : ''}
          {type === 'warning' ? 'text-warning-600' : ''}
          {type === 'success' ? 'text-success-600' : ''}
          {type === 'info' ? 'text-surface-400 dark:text-surface-200' : ''}
        "
      />

      <div>
        <h1
          class="
        font-bold
        text-lg sm:text-xl md:text-2xl xl:text-4xl
      "
        >
          {title}
        </h1>

        <p class="font-light text-sm sm:text-base md:text-xl">
          <SvelteMarkdown source={description} isInline />
        </p>
      </div>
    </section>

    <hr class="border-gray-500/50 mb-2 mt-4" />

    <section class="mt-4 flex gap-2 justify-center">
      {#if Array.isArray(options)}
        {#each options as { type, text, action }}
          <Button {type} on:click={action}>
            {text}
          </Button>
        {/each}
      {:else}
        <Button type="primary" on:click={options}>Yes</Button>
        <Button type="secondary" on:click={() => modalState.remove(modalId)}>
          Cancel
        </Button>
      {/if}
    </section>
  </main>
</Modal>
