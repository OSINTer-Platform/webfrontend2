<script lang="ts">
  import CollectionButton from "./button.svelte";
  import { page } from "$app/stores";
  import type { ArticleBase } from "$shared/types/api";

  $: userCollections = $page.data.userCollections;
  export let article: ArticleBase;

  export let containerClass: string = "";
  export let overlayClass: string = "top-10";
  export let btnClass: string = "pb-2";
  export let iconClass: string = "text-4xl";
</script>

<div
  class="
  flex justify-center items-center
  h-full w-full
  bg-black/75 opacity-0

  transition-opacity

  [&:focus-within>button>svg]:text-primary-500
  {containerClass}
"
>
  <CollectionButton
    {userCollections}
    {article}
    {overlayClass}
    {btnClass}
    iconClass={iconClass + " text-white"}
  />
</div>
