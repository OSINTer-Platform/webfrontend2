<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";

  import Switch from "$com/utils/inputs/switch.svelte";
  import Search from "$com/utils/inputs/search.svelte";
  import List from "./list.svelte";

  import { ListRenderModes } from "$shared/config";
  import { page } from "$app/stores";
  import {
    faEye,
    faEyeSlash,
    faHeading,
    faHighlighter,
  } from "@fortawesome/free-solid-svg-icons";
  import { hasHighlights } from "$lib/common/filter";
  import { listElementCount, showHighlights, showRead } from "$state/state";

  export let articles: ArticleBase[];
  let search: string = "";

  $: user = $page.data.user;
  $: articleWithHighlight = hasHighlights(articles);
  $: listRenderMode = $page.data.settings.listRenderMode;
</script>

<div class="flex gap-6 px-6 sm:px-12 mt-3 sm:mt-6">
  <section class="flex gap-6">
    {#each ListRenderModes as { name, value }}
      <label
        class="
        px-4 py-1 active:scale-95
        cursor-pointer

        transition-all

        {$listRenderMode === value
          ? 'bg-primary-600/60 hover:dark:bg-primary-600/70'
          : 'dark:text-primary-600 bg-primary-600/10 hover:bg-primary-400/20 hover:dark:bg-primary-500/20'}

        border border-primary-500

        font-medium text-sm
      "
      >
        <input
          type="radio"
          bind:group={$listRenderMode}
          {value}
          class="hidden"
        />
        {name}
      </label>
    {/each}
  </section>

  <Search
    bind:value={search}
    placeholder="Filter articles..."
    containerClass="grow"
    infoText={`${$listElementCount} articles`}
  />

  {#if articleWithHighlight || $user}
    <div class="self-center flex gap-2">
      {#if $user}
        <Switch
          title="{$showRead
            ? 'Show'
            : 'Hide'} articles which have been read already"
          name="show-read"
          bind:checked={$showRead}
          icons={{ on: faEye, off: faEyeSlash }}
          size="lg"
        />
      {/if}
      {#if articleWithHighlight}
        <Switch
          title={$showHighlights
            ? "Show article search highlights"
            : "Show article title"}
          name="show-read"
          bind:checked={$showHighlights}
          icons={{ on: faHighlighter, off: faHeading }}
          iconClass="text-sm"
          size="lg"
        />
      {/if}
    </div>
  {/if}
</div>

<List {articles} {search} />
