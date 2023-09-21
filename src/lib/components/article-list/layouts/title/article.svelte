<script lang="ts">
  import Fa from "svelte-fa/src/fa.svelte";
  import SvelteMarkdown from "svelte-markdown";

  import Link from "../../../modalLink.svelte";
  import CollectionList from "../../components/collectionList.svelte";

  import { getTimespan } from "$lib/common/math";
  import { faStar } from "@fortawesome/free-regular-svg-icons";

  import type { ArticleBase } from "$shared/types/api";
  import type { Collection } from "$shared/types/userItems";
  import type { Writable } from "svelte/store";

  export let userCollections: Writable<{ [key: string]: Collection }>;
  export let article: ArticleBase;
  export let read: boolean;
</script>

<Link
  articleId={article.id}
  class="
  flex
  items-center
  gap-4

  md:p-2
  p-1

  border-t
  border-tertiary-500
  dark:border-surface-400

  hover:bg-surface-50
  dark:hover:bg-surface-500

  [&:hover>aside]:flex
  [&:hover>aside]:bg-surface-50
  [&:hover>aside]:dark:bg-surface-500
  relative
"
  title={article.tags.automatic.map((tag) => tag.toUpperCase()).join(" | ")}
>
  <p
    class="
  hidden
  lg:hidden

  xl:block
  md:block

  truncate
  text-xs
  font-light

  w-1/12
  shrink-0
  dark:text-white
  dark:font-medium
"
  >
    {article.source}
  </p>
  <div
    class="
  flex
  flex-row
  gap-2

  shrink
  grow
  overflow-hidden
"
  >
    <h1
      class="
    text-sm md:text-base
    {read ? 'opacity-60' : 'font-semibold'}

    truncate
    shrink-0

    dark:text-white

    [&>strong]:font-semibold
    [&>strong]:text-primary-600
  "
    >
      <SvelteMarkdown source={article.title} isInline />
    </h1>

    <p
      class="

    {read ? 'opacity-60 font-light' : ''}
    text-xs
    leading-5

    md:text-sm
    md:leading-6

    truncate
    text-tertiary-800

    dark:text-white

    [&>strong]:font-semibold
    [&>strong]:text-primary-400
  "
    >
      <SvelteMarkdown source={article.title} isInline />
    </p>
  </div>
  <aside
    on:click|preventDefault|stopPropagation
    on:keydown|preventDefault|stopPropagation
    class="
        absolute right-16 md:right-20 z-10
        hidden justify-center
        h-full px-2
        bg-surface-100 dark:bg-surface-900
      "
  >
    {#if Object.values($userCollections).length > 0}
      <CollectionList
        {userCollections}
        articleId={article.id}
        class="top-8 right-0"
      >
        <Fa
          icon={faStar}
          class="
              ml-auto my-auto
              text-lg md:text-xl
              text-black/75 dark:text-white/90
              hover:text-primary-500
              transition-colors
            "
        />
      </CollectionList>
    {/if}
  </aside>
  <time
    title={article.publish_date}
    class:opacity-60={read}
    class="text-xs font-extralight shrink-0 dark:text-white sm:dark:font-medium"
    >{getTimespan(article.publish_date)}</time
  >
</Link>
