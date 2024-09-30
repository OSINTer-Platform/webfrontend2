<script lang="ts">
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let submitText: string;
  export let submissionState: SubmissionState;

  $: processing = submissionState?.state === "loading";
</script>

<button
  disabled={processing}
  class="
  w-full mt-4 h-16 rounded-sm
  shadow shadow-gray-400 dark:shadow-black
  bg-primary-500/40 hover:bg-primary-500/50
  active:scale-95 transition-all duration-300
  font-bold text-lg
"
>
  {#if processing}
    <Fa icon={faSpinner} class="animate-spin mx-auto" />
  {:else}
    {submitText}
  {/if}
</button>

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
