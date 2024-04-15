<script lang="ts">
  import { getTimespan } from "$lib/common/math";
  import { eclipseConcat } from "$lib/common/strings";
  import { expandHighlights, expandSummary } from "$shared/state/state";

  import type { ArticleBase } from "$shared/types/api";
  import {
    faHighlighter,
    faRectangleList,
    type IconDefinition,
  } from "@fortawesome/free-solid-svg-icons";

  import Large from "$com/itemList/generic/layouts/large.svelte";
  import CollectionOverlay from "$com/collections/buttonOverlay.svelte";
  import Link from "$com/modalLink.svelte";

  export let article: ArticleBase;
  export let articleList: ArticleBase[];
  export let readArticles: string[];
  export let showHighlights: boolean;

  $: read = readArticles.includes(article.id);

  $: title =
    article.highlights?.title && showHighlights
      ? { text: eclipseConcat(article.highlights.title), markdown: true }
      : { text: article.title, markdown: false };

  $: description =
    article.highlights?.description && showHighlights
      ? { text: eclipseConcat(article.highlights.description), markdown: true }
      : { text: article.description, markdown: false };

  let textExpands: {
    title: string;
    icon: IconDefinition;
    content: string;
    expanded: boolean;
    markdown: boolean;
  }[];

  $: textExpands = [
    ...(article.highlights?.content && article.highlights.content.length > 0
      ? [
          {
            title: "highlights",
            icon: faHighlighter,
            content: eclipseConcat(article.highlights.content),
            expanded: $expandHighlights,
            markdown: true,
          },
        ]
      : []),
    ...(article.summary && article.summary.length > 0
      ? [
          {
            title: "summary",
            icon: faRectangleList,
            content: article.summary,
            expanded: $expandSummary,
            markdown: false,
          },
        ]
      : []),
  ];
</script>

<hr class="border-tertiary-500 dark:border-surface-500" />

<Link {article} {articleList}>
  <Large
    {title}
    {description}
    leftLegend={{ text: article.source, hover: `Profile: ${article.profile}` }}
    rightLegend={{
      text: getTimespan(article.publish_date),
      hover: article.publish_date,
    }}
    imageUrl={article.image_url}
    tags={article.tags.automatic}
    {textExpands}
    {read}
  >
    <svelte:fragment slot="icons">
      <CollectionOverlay {article} />
    </svelte:fragment>
  </Large>
</Link>
