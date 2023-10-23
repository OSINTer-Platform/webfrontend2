<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import Link from "../../../modalLink.svelte";
  import Icons from "./icons.svelte";
  import Loader from "$com/loader.svelte";

  import type { ArticleBase } from "$shared/types/api";
  import type { Collection } from "$shared/types/userItems";
  import type { Writable } from "svelte/store";

  import { getTimespan } from "$lib/common/math";
  import { PUBLIC_API_BASE } from "$env/static/public";

  export let userCollections: Writable<{ [key: string]: Collection }>;
  export let article: ArticleBase;
  export let articleList: ArticleBase[];
  export let read: boolean;

  let similarArticles: null | Promise<ArticleBase[]> = null;
  let showSimilar = false;

  async function toggleShowSimilar(e: { detail: any }) {
    if (e.detail !== article.id) return;

    showSimilar = !showSimilar;

    if (similarArticles) return;

    similarArticles = fetch(
      `${PUBLIC_API_BASE}/articles/${encodeURIComponent(article.id)}/similar`
    ).then(async (r) => {
      if (r.ok) {
        return r.json();
      } else {
        console.error(
          "Failed when querying similar articles for title-style article list dropdown"
        );
        return null;
      }
    });
  }
</script>

<Link
  articleId={article.id}
  {articleList}
  class="
  flex
  items-center
  gap-4

  md:p-2
  p-1

  border-y
  border-tertiary-500
  dark:border-surface-400

  [&+a]:border-t-0

  hover:bg-surface-50
  dark:hover:bg-surface-500

  [&:hover>aside]:flex
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
      <SvelteMarkdown source={article.description} isInline />
    </p>
  </div>

  <Icons {article} {userCollections} on:showSimilar={toggleShowSimilar} />

  <time
    title={article.publish_date}
    class:opacity-60={read}
    class="text-xs font-extralight shrink-0 dark:text-white sm:dark:font-medium"
    >{getTimespan(article.publish_date)}</time
  >
</Link>

{#if showSimilar && similarArticles}
  <ul class="">
    {#await similarArticles}
      <Loader rows={1} class="m-6 w-14" />
    {:then articleList}
      {#each articleList as article}
        <li class="relative ml-3 md:ml-6 xl:ml-10">
          <div class="absolute w-full h-full bg-primary-600/10" />

          <svelte:self {article} {userCollections} {articleList} read={false} />
        </li>
      {/each}
    {/await}
  </ul>
{/if}
