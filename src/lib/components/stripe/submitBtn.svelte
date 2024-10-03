<script lang="ts">
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import type { SideButtons, SubmissionState } from "./shared";

  export let submitText: string;
  export let submissionState: SubmissionState;
  export let sideButtons: SideButtons;

  $: processing = submissionState?.state === "loading";
</script>

<div class="flex gap-4 w-full mt-4">
  <button disabled={processing} class="grow font-bold text-lg">
    {#if processing}
      <Fa icon={faSpinner} class="animate-spin mx-auto" />
    {:else}
      {submitText}
    {/if}
  </button>

  {#if sideButtons}
    {#each sideButtons as { title, icon, action }}
      <button
        class="w-16 flex justify-center items-center"
        {title}
        on:click={action}
      >
        <Fa {icon} />
      </button>
    {/each}
  {/if}
</div>

{#if submissionState?.msg}
  <p
    class="
      text-center font-light sm:text-lg
      mt-2 leading-tight
      {submissionState.state === 'error' ? 'text-error-500:' : ''}
    "
  >
    {submissionState.msg}
  </p>
{/if}

<style lang="postcss">
  button {
    @apply h-16 rounded-sm
    shadow shadow-gray-400 dark:shadow-black
    bg-primary-500/40 hover:bg-primary-500/50
    active:scale-95 transition-all duration-300;
  }
</style>
