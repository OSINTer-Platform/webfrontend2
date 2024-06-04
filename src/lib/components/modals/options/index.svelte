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
  export let description: string | string[];
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

  const close = () => modalState.remove(modalId);
</script>

<Modal
  class="
    p-6
    w-[30rem] md:w-[50rem] max-w-[90vw]
    flex flex-col
    overflow-y-auto

    bg-surface-100 dark:bg-surface-800
  "
  style="max-height: min(90vh, 40rem)"
>
  <main class="flex flex-col">
    <section class="flex grow items-center text-contents flex-col md:flex-row">
      <Fa
        icon={modalIcons[type]}
        class="
          text-7xl md:text-6xl
          md:mt-1 md:ml-4 md:mr-6 mb-4
          md:mb-0 lg:mr-8 xl:mr-10
          {type === 'error' ? 'text-primary-600/50' : ''}
          {type === 'warning' ? 'text-warning-600' : ''}
          {type === 'success' ? 'text-success-600' : ''}
          {type === 'info' ? 'text-surface-400 dark:text-surface-200' : ''}
        "
      />

      <div>
        <h1
          class="
            font-bold mb-1
            text-lg sm:text-xl md:text-2xl xl:text-4xl
          "
        >
          {title}
        </h1>

        {#if Array.isArray(description)}
          {#each description as desc}
            <p class="font-light text-sm sm:text-base md:text-lg">
              <SvelteMarkdown source={desc} isInline />
            </p>
          {/each}
        {:else}
          <p class="font-light text-sm sm:text-base md:text-lg">
            <SvelteMarkdown source={description} isInline />
          </p>
        {/if}
      </div>
    </section>

    <hr class="border-gray-500/50 mb-2 mt-4" />

    <section class="mt-4 flex gap-2 justify-center">
      {#if Array.isArray(options)}
        {#each options as { type, text, action }}
          <Button {type} {action} {close}>
            {text}
          </Button>
        {/each}
      {:else}
        {@const action = options}
        <Button type="primary" {action} {close}>Yes</Button>
        <Button type="secondary" action={() => true} {close}>Cancel</Button>
      {/if}
    </section>
  </main>
</Modal>

<style lang="postcss">
  .text-contents {
    :global(a) {
      @apply underline hover:text-primary-500 transition-colors duration-300;
    }
  }
</style>
