<script lang="ts">
  import Collections from "$com/collections.svelte";
  import { modalState } from "$shared/state/state";
  import type { ArticleBase } from "$shared/types/api";
  import type { Collection } from "$shared/types/userItems";
  import type { Writable } from "svelte/store";

  export let btnClass: string = "";
  let classes: string = "";
  export { classes as class };

  export let userCollections: Writable<{ [key: string]: Collection }>;
  export let article: ArticleBase;
</script>

<button
  class="
		relative
		[&:focus-within>div]:block
		[&:hover>div]:block
		{btnClass}
	"
  on:click={() =>
    modalState.set({
      modalType: "add-collection",
      modalContent: { article: article },
    })}
>
  <slot />
  <div
    on:keydown|stopPropagation
    on:click|stopPropagation
    on:mousedown|preventDefault
    class="
		hidden absolute z-20
    p-2

		bg-surface-100 dark:bg-surface-800
		border border-tertiary-500

		rounded-lg shadow-xl

		cursor-default
		{classes}
	"
  >
    <Collections {userCollections} articleId={article.id} />
  </div>
</button>
