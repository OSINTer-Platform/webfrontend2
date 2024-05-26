<script lang="ts">
  import type { FullArticle, ArticleBase } from "$shared/types/api";
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  import ModalLink from "$com/modalLink.svelte";
  import Fa from "svelte-fa";

  import {
    faCaretDown,
    faCaretUp,
    faList,
    faSitemap,
  } from "@fortawesome/free-solid-svg-icons";
  import { goto } from "$app/navigation";
  import { getReadableDate } from "$lib/common/math";

  export let mainArticle: FullArticle;
  export let articles: ArticleBase[];
  let showAll = false;

  $: articleList = showAll ? articles : articles.slice(0, 9);

  let buttonActions: Array<{
    icon: IconDefinition;
    description: string;
    action: () => void;
  }>;
  $: buttonActions = [
    ...(articles.length > 9
      ? [
          {
            icon: showAll ? faCaretUp : faCaretDown,
            description: `${
              showAll ? "Hide most" : "Show all"
            } similar articles`,
            action: () => (showAll = !showAll),
          },
        ]
      : []),
    {
      icon: faList,
      description: "See list of similar articles",
      action: () => {
        goto(`/article/${mainArticle.id}/similar`);
      },
    },
    ...(mainArticle.ml && mainArticle.ml.cluster.length > 0
      ? [
          {
            icon: faSitemap,
            description: "See article cluster",
            action: () => {
              goto(`/topic/${mainArticle.ml?.cluster}`);
            },
          },
        ]
      : []),
  ];
</script>

<section
  class="
  grid grid-cols-3
"
>
  {#each articleList as article}
    <ModalLink
      {article}
      articleList={articles}
      class="
      p-4
      hover:bg-surface-400/20
    "
    >
      <header class="absolute-grid">
        <img
          src={article.image_url}
          alt="Article header"
          class="
        w-full aspect-video object-cover
      "
        />

        <div class="bg-gradient-to-t from-black" />

        <div
          class="
          flex justify-between p-2 items-end
          font-light text-sm text-white
      "
        >
          <span>{article.source}</span>
          <span>{getReadableDate(article.publish_date)}</span>
        </div>
      </header>

      <h4
        class="
        tracking-tight leading-tight p-2 h-24
        font-bold
      "
      >
        {article.title}
      </h4>
    </ModalLink>
  {/each}
</section>

<hr class="border-tertiary-700/25 mb-8" />

<section class="flex justify-center">
  {#each buttonActions as { icon, description, action }}
    <button
      title={description}
      on:click={action}
      class="
      btn w-16 aspect-square
    "><Fa {icon} /></button
    >
    <div class="h-16 w-0 mx-4 border-l border-surface-400 last:hidden" />
  {/each}
</section>
