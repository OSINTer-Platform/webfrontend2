<script lang="ts">
  import Fa from "svelte-fa";
  import CollectionList from "./list.svelte";

  import { faStar } from "@fortawesome/free-regular-svg-icons";
  import { modalState } from "$state/modals";

  import type { ArticleBase } from "$shared/types/api";
  import type { Collection } from "$shared/types/userItems";
  import type { Writable } from "svelte/store";

  export let btnClass: string = "";
  export let iconClass: string = "";
  export let overlayClass: string = "";

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
    modalState.append({
      modalType: "add-collection",
      modalContent: { article: article },
    })}
>
  <Fa
    icon={faStar}
    class="
    hover:text-primary-500
    transition-colors
    text-black dark:text-white/90 {iconClass}
  "
  />
  <div
    on:keydown|stopPropagation|preventDefault
    on:click|stopPropagation|preventDefault
    on:mousedown|stopPropagation|preventDefault
    class="
		hidden absolute z-20
    p-2 max-w-md

		bg-surface-100 dark:bg-surface-800
		border border-tertiary-500

		rounded-lg shadow-xl

		cursor-default
		{overlayClass}
	"
  >
    <CollectionList {userCollections} articleId={article.id} />
  </div>
</button>
