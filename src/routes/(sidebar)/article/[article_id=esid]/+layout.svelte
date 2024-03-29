<script lang="ts">
  import ModList from "$com/article-list/header/modList.svelte";
  import DetailList from "$com/article-list/header/detailList.svelte";

  import type { ArticleTags } from "$shared/types/api";
  import type { HeaderModOptions } from "$shared/types/internal";
  import type { LayoutData } from "./$types";

  import {
    faClipboard,
    faPaste,
    faStar,
  } from "@fortawesome/free-regular-svg-icons/index";

  import {
    faDownload,
    faSitemap,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons/index";

  import { fullArticles } from "$state/storedArticles";
  import { goto } from "$app/navigation";

  import { PUBLIC_API_BASE } from "$env/static/public";
  import { modalState } from "$shared/state/modals";

  export let data: LayoutData;

  function getTags(tags: ArticleTags) {
    const extractedTags: {
      [key: string]: string[] | { content: string; href: string }[];
    } = {};

    if (tags.automatic.length > 1) {
      extractedTags["Automatic Tags"] = tags.automatic.map((tag) => ({
        content: tag,
        href: `/feed/search?sort_by=publish_date&search_term=${encodeURIComponent(
          tag
        )}`,
      }));
    }

    if (tags.interesting.length > 0) {
      for (const { name, values } of tags.interesting) {
        extractedTags[name.toUpperCase()] = values;
      }
    }

    return extractedTags;
  }

  $: overviews = [
    {
      Sources: [
        `Medium: ${data.article.source}`,
        `Author: ${data.article.author ?? data.article.source}`,
      ],
    },
    {
      Dates: [
        `Published: ${data.article.publish_date}`,
        `Scraped: ${data.article.inserted_at}`,
      ],
    },
  ];

  $: tags = getTags(data.article.tags);

  let modOptions: Array<HeaderModOptions>;

  $: modOptions = [
    ...(data.article.ml && data.article.ml.cluster.length > 0
      ? [
          {
            title: "Go to article cluster",
            icon: faSitemap,
            route: `/topic/${data.article.ml.cluster}`,
          },
        ]
      : []),
    {
      title: "Add to collection",
      icon: faStar,
      action: () =>
        modalState.append({
          modalType: "add-collection",
          modalContent: { article: data.article },
        }),
    },
    {
      title: `Copy raw`,
      icon: faClipboard,
      action: () => navigator.clipboard.writeText(data.article.content),
    },
    {
      title: `Copy formatted`,
      icon: faPaste,
      action: () =>
        navigator.clipboard.writeText(data.article.formatted_content),
    },
    {
      title: "Download MD",
      icon: faDownload,
      route: `${PUBLIC_API_BASE}/articles/${data.article.id}/export`,
      options: {
        download: "true",
      },
    },
    {
      title: "Close article",
      icon: faXmark,
      action: () => {
        fullArticles.update((content) => {
          delete content[data.article.id];
          return content;
        });
        goto("/article");
      },
    },
  ];
</script>

<svelte:head>
  <meta property="article:published_time" content={data.article.publish_date} />
  <meta
    property="article:author"
    content={data.article.author ?? data.article.source}
  />
</svelte:head>

<aside
  class="
	bg-surface-200
	dark:bg-surface-900

	border-b border-surface-300 dark:border-surface-400

	p-6
	sm:p-12
	!pb-4
"
>
  <header class="flex justify-between mb-3">
    <h1 class="sm:text-5xl text-3xl xl:max-w-5xl">
      {data.article.title}
    </h1>

    <section class="flex items-start shrink-0">
      <ModList {modOptions} />
    </section>
  </header>

  <p class="italic font-light dark:font-medium">
    {data.article.description}
  </p>

  <hr class="my-4 border-tertiary-700/50" />
  {#each overviews as overview}
    <DetailList options={overview} mono={false} />
    <hr class="my-4 border-tertiary-700/50" />
  {/each}

  {#if Object.values(tags).length > 0}
    <DetailList options={tags} mono={true} />
    <hr class="my-4 border-tertiary-700/50" />
  {/if}
</aside>

<slot />
