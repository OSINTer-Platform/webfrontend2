<script lang="ts">
  import type { Writable } from "svelte/store";

  import Fa from "svelte-fa";

  import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  export let tagProcessor: (w: string) => string = (w) => w;
  export let keywords: Writable<string[]>;
  export let hoverText = "";
  export let buttons: {
    title: string;
    content: string;
    icon: IconDefinition;
    action: () => void;
  }[] = [];
  let tagInput = "";

  const removeKeyword = (remove: string) =>
    keywords.update((words) => words.filter((w) => w !== remove));

  function catchTrendInput(e: InputEvent) {
    if (
      ["insertLineBreak", "insertParagraph"].includes(e.inputType) ||
      (e.inputType === "insertText" && e.data === " ")
    ) {
      e.preventDefault();
      $keywords = [...$keywords, tagProcessor(tagInput)];
      tagInput = "";
    }
  }
</script>

<aside class="flex flex-wrap gap-2 w-full mb-2">
  {#each $keywords.toSorted() as keyword}
    <button
      on:mouseenter={() => (hoverText = keyword)}
      on:mouseleave={() => (hoverText = "")}
      class="
        flex items-center gap-1 p-1
        border border-surface-400/50
        text-xs
        cursor-pointer

        {hoverText.length > 0 && hoverText !== keyword
        ? 'text-black/50 dark:text-white/50'
        : 'dark:text-white'}

        transition-colors
      "
      on:click={() => removeKeyword(keyword)}
      title="Remove {keyword}"
    >
      <Fa icon={faX} />
      {keyword}
    </button>
  {/each}

  <label
    class="
    flex justify-center items-center gap-2 p-1
    border border-surface-300/50 hover:border-surface-300/75
    transition-colors duration-300
    text-tertiary-800 cursor-text text-xs
  "
  >
    <Fa icon={faPlus} />

    <input
      bind:value={tagInput}
      on:beforeinput={catchTrendInput}
      placeholder="Add tag"
      class="
        grow h-full w-20
        bg-transparent text-xs dark:text-white
        border-0 focus:outline-none focus:border-0
    "
    />
  </label>

  {#each buttons as { title, content, action, icon }}
    <button
      class="
        flex items-center gap-1 p-1
        border border-surface-400/50

        text-xs
        text-black/50 dark:text-white/50
        hover-text-white hover:dark:text-white
        transition-colors
      "
      on:click={action}
      {title}
    >
      <Fa {icon} />
      {content}
    </button>
  {/each}
</aside>
