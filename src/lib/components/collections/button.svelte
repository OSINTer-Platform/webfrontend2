<script lang="ts">
  import Fa from "svelte-fa";
  import CollectionList from "./list.svelte";

  import { faStar } from "@fortawesome/free-regular-svg-icons";
  import { modalState } from "$state/modals";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  import type { ArticleBase } from "$shared/types/api";
  import type { Collection } from "$shared/types/userItems";
  import type { Writable } from "svelte/store";

  export let btnClass: string = "";
  export let iconClass: string = "";
  export let overlayClass: string = "";

  export let userCollections: Writable<{ [key: string]: Collection }>;
  export let article: ArticleBase;

  $: user = $page.data.user;
</script>

<div class="relative">
  <button
    class="
      relative
      peer
      {btnClass}
    "
    on:click={() => {
      if ($user)
        modalState.append({
          modalType: "add-collection",
          modalContent: { article: article },
        });
      else
        goto(
          "/login?msg=" +
            encodeURIComponent(
              "You have to log in to access custom collections"
            )
        );
    }}
  >
    <Fa
      icon={faStar}
      class="
      hover:text-primary-500 dark:hover:text-primary-500
      transition-colors
      {iconClass}
    "
    />
  </button>
  {#if Object.values($userCollections).length > 0}
    <div
      role="presentation"
      on:keydown|stopPropagation|preventDefault
      on:click|stopPropagation|preventDefault
      on:mousedown|stopPropagation|preventDefault
      class="
      hover:block peer-hover:block peer-focus-within:block
      hidden absolute z-20
      p-2 max-w-md

      bg-surface-100 dark:bg-surface-800
      border border-tertiary-500

      shadow-xl

      cursor-default
      {overlayClass}
    "
    >
      <CollectionList {userCollections} articleId={article.id} />
    </div>
  {/if}
</div>
