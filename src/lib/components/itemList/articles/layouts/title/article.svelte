<script lang="ts">
  import Link from "$com/modalLink.svelte";
  import Icons from "./icons.svelte";
  import Loader from "$com/loader.svelte";
  import Title from "$com/itemList/generic/layouts/title.svelte";

  import type { ArticleBase } from "$shared/types/api";

  import { eclipseConcat } from "$lib/common/strings";
  import { getTimespan } from "$lib/common/math";
  import { PUBLIC_API_BASE } from "$env/static/public";

  export let article: ArticleBase;
  export let articleList: ArticleBase[];
  export let readArticles: string[];
  export let showHighlights: boolean;

  $: title =
    article.highlights?.title && showHighlights
      ? { text: eclipseConcat(article.highlights.title), markdown: true }
      : { text: article.title, markdown: false };

  $: description =
    article.highlights?.description && showHighlights
      ? { text: eclipseConcat(article.highlights.description), markdown: true }
      : { text: article.description, markdown: false };

  $: read = readArticles.includes(article.id);

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

<Link {article} {articleList}>
  <Title
    {title}
    {description}
    leftLegend={{ hover: article.profile, text: article.source }}
    rightLegend={{
      hover: article.publish_date,
      text: getTimespan(article.publish_date),
    }}
    {read}
    tags={article.tags.automatic.map((t) => t.toLowerCase())}
  >
    <svelte:fragment slot="icons">
      <Icons {article} on:showSimilar={toggleShowSimilar} />
    </svelte:fragment>
  </Title>
</Link>

{#if showSimilar && similarArticles}
  <ul class="">
    {#await similarArticles}
      <Loader rows={1} class="m-6 w-14" />
    {:then articleList}
      {#each articleList as article (article.id)}
        <li class="relative ml-3 md:ml-6 xl:ml-10">
          <div class="absolute w-full h-full bg-primary-600/10" />

          <svelte:self {article} {articleList} {readArticles} />
        </li>
      {/each}
    {/await}
  </ul>
{/if}
