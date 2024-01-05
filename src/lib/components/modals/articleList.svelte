<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";

  import Modal from "./modal.svelte";
  import List from "$com/article-list/main.svelte";

  import { ListRenderModes } from "$shared/config";
  import type { ArticleListRender } from "$shared/types/internal";
  import Switch from "$com/utils/inputs/switch.svelte";
  import { page } from "$app/stores";
  import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
  import { filterArticles } from "$lib/common/filter";
  import Search from "$com/utils/inputs/search.svelte";

  export let articles: ArticleBase[];
  let listRenderMode: ArticleListRender = "large";
  let showRead: boolean = true;
  let search: string = "";

  $: alreadyReadCollection = $page.data.alreadyRead;
  $: filteredArticles = filterArticles(
    articles,
    search,
    !showRead && alreadyReadCollection ? $alreadyReadCollection?.ids : []
  );
</script>

<Modal
  class="
    w-[90vw] h-[95vh]
    flex flex-col

    border border-tertiary-500/75
    bg-surface-100 dark:bg-surface-900
  "
>
  <div class="flex gap-6 px-6 sm:px-12 mt-3 sm:mt-6">
    <section class="flex gap-6">
      {#each ListRenderModes as { name, value }}
        <label
          class="
          px-4 py-1 active:scale-95
          cursor-pointer

          transition-all

          {listRenderMode === value
            ? 'dark:text-white bg-primary-600/60 hover:dark:bg-primary-600/70'
            : 'dark:text-primary-600 bg-primary-600/10 hover:bg-primary-400/20 hover:dark:bg-primary-500/20'}

          border border-primary-500

          font-medium text-sm
        "
        >
          <input
            type="radio"
            bind:group={listRenderMode}
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
    />

    {#if $page.data.user}
      <div class="self-center">
        <Switch
          title="{showRead
            ? 'Show'
            : 'Hide'} articles which have been read already"
          name="show-read"
          bind:checked={showRead}
          icons={{ on: faEye, off: faEyeSlash }}
          size="lg"
        />
      </div>
    {/if}
  </div>

  <main class="m-6 sm:m-12 mt-3 sm:mt-6 overflow-y-auto">
    <List
      articles={filteredArticles}
      tintReadArticles={true}
      layout={listRenderMode}
    />
  </main>
</Modal>
