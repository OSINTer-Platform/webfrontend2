<script>
  import PromptList from "./promptList.svelte";
  import Searchbar from "./searchbar.svelte";

  let initialSubmittet = false;
  let initialValue = "";
</script>

<section
  class="
    flex flex-row w-full
    bg-surface-100 dark:bg-surface-800
"
>
  <main
    class="
      max-w-2xl
      grow

      min-h-full h-fit p-8 mx-auto
      flex flex-col
"
  >
    {#if !initialSubmittet}
      <Searchbar
        bind:value={initialValue}
        on:submit={() => (initialSubmittet = true)}
        class="my-auto"
      />
    {:else}
      <PromptList initialPrompt={initialValue} />
    {/if}
  </main>
</section>
