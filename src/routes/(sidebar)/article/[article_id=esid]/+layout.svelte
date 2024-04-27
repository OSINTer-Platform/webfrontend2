<script lang="ts">
  import HeaderShell from "$com/itemList/header/shell.svelte";
  import DetailList from "$com/itemList/header/detailList.svelte";

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

  import { similarSearch } from "$state/storedArticles";
  import { goto } from "$app/navigation";

  import { PUBLIC_API_BASE } from "$env/static/public";
  import { modalState } from "$shared/state/modals";
  import { page } from "$app/stores";

  export let data: LayoutData;

  function getTags(tags: ArticleTags) {
    const extractedTags: {
      title: string;
      content: string[] | { content: string; href: string }[];
      mono: boolean;
    }[] = [];

    if (tags.automatic.length > 1) {
      extractedTags.push({
        title: "Automatic Tags",
        mono: false,
        content: tags.automatic.map((tag) => ({
          content: tag,
          href: `/news/search?sort_by=publish_date&search_term=${encodeURIComponent(
            tag
          )}`,
        })),
      });
    }

    if (tags.interesting.length > 0) {
      for (const { name, values } of tags.interesting) {
        extractedTags.push({
          title: name.toUpperCase(),
          content: values,
          mono: true,
        });
      }
    }

    return extractedTags;
  }

  $: articleDetails = [
    [
      {
        title: "Sources",
        content: [
          `Medium: ${data.article.source}`,
          `Author: ${data.article.author ?? data.article.source}`,
        ],
        mono: false,
      },
      {
        title: "Sources",
        content: [
          `Published: ${data.article.publish_date}`,
          `Scraped: ${data.article.inserted_at}`,
        ],
        mono: false,
      },
    ],
    getTags(data.article.tags),
  ];

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
        goto("/news/previously-read");
      },
    },
  ];

  const updateReadArticles = (id: string) =>
    data.readArticles.update((ids) => [id, ...ids]);

  $: updateReadArticles(data.article.id);
</script>

<svelte:head>
  <meta property="article:published_time" content={data.article.publish_date} />
  <meta
    property="article:author"
    content={data.article.author ?? data.article.source}
  />
</svelte:head>

<HeaderShell
  title={data.article.title}
  description={data.article.description}
  {modOptions}
  searchAble={$page.url.pathname.includes("similar")}
  searchSubmitable={false}
  tabs={null}
  bind:searchValue={$similarSearch}
>
  <DetailList detailBatches={articleDetails} />
</HeaderShell>

<slot />
