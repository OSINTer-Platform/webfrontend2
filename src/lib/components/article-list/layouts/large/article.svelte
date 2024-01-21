<script lang="ts">
  import { getTimespan } from "$lib/common/math";
  import { eclipseConcat } from "$lib/common/strings";

  import type { ArticleBase } from "$shared/types/api";

  import Large from "$com/utils/listElements/large.svelte";
  import CollectionOverlay from "$com/collections/buttonOverlay.svelte";
  import Link from "$com/modalLink.svelte";

  export let article: ArticleBase;
  export let articleList: ArticleBase[];
  export let readArticles: string[];

  $: read = readArticles.includes(article.id);

  $: title = article.highlights?.title
    ? { text: eclipseConcat(article.highlights.title), markdown: true }
    : { text: article.title, markdown: false };

  $: description = article.highlights?.description
    ? { text: eclipseConcat(article.highlights.description), markdown: true }
    : { text: article.description, markdown: false };
</script>

<hr class="text-tertiary-500 dark:text-surface-500" />

<Link articleId={article.id} {articleList}>
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
    summary={article.summary ?? ""}
    {read}
  >
    <svelte:fragment slot="actions">
      <CollectionOverlay {article} />
    </svelte:fragment>
  </Large>
</Link>
