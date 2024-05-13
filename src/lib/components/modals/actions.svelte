<script lang="ts">
  import { modalState } from "$shared/state/modals";

  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  import Modal from "./modal.svelte";
  import Loader from "$com/loader.svelte";
  import Fa from "svelte-fa";

  type Action = () => void | boolean | Promise<void> | Promise<boolean>;

  export let modalId: string;
  export let options: {
    action: Action;
    text: string;
    icon?: IconDefinition;
  }[];

  let loading = false;

  async function handleAction(action: Action) {
    if (loading) return;
    loading = true;

    const r = await action();
    if (r !== false) modalState.remove(modalId);
    loading = false;
  }
</script>

<Modal
  class="
    p-3 sm:p-6
    w-[40rem] max-w-[90vw]
    flex flex-col
    overflow-y-auto

    bg-surface-100 dark:bg-surface-800
  "
  style="max-height: min(90vh, 40rem)"
>
  {#if loading}
    <Loader text="Handling action" />
  {:else}
    <ul>
      {#each options as { action, text, icon }}
        <hr class="border-surface-400/50 my-2 first:hidden" />
        <li>
          <button
            on:click={() => handleAction(action)}
            class="
              flex items-center justify-start
              p-4 btn w-full
            "
          >
            {#if icon}
              <div
                class="
                text-2xl pr-4 h-full
                border-r-2 border-surface-400/50
              "
              >
                <Fa class="h-8 w-8" {icon} />
              </div>
            {/if}
            <p
              class="
              text-start
              first:ml-0 ml-4
              font-light text-lg sm:text-2xl
            "
            >
              {text}
            </p>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</Modal>
