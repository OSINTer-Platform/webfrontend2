<script lang="ts">
  import Fa from "svelte-fa";

  import Link from "../../../modalLink.svelte";
  import CollectionList from "../../components/collectionList.svelte";

  import { getTimespan } from "$lib/common/math";
  import { faStar } from "@fortawesome/free-regular-svg-icons";

  import type { ArticleBase } from "$shared/types/api";
  import type { Collection } from "$shared/types/userItems";
  import type { Writable } from "svelte/store";
  import Large from "$com/utils/listElements/large.svelte";

  export let userCollections: Writable<{ [key: string]: Collection }>;
  export let article: ArticleBase;
  export let articleList: ArticleBase[];
  export let readArticles: string[];

  $: read = readArticles.includes(article.id);
</script>

<hr class="text-tertiary-500 dark:text-surface-500" />

<Link articleId={article.id} {articleList}>
  <Large
    title={article.title}
    description={article.description}
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
      {#if Object.values($userCollections).length > 0}
        <div
          class="
          flex justify-center items-center
          h-full w-full
          bg-black/75 opacity-0
          rounded-md

          transition-opacity

          [&:focus-within>button>svg]:text-primary-500
        "
        >
          <CollectionList
            {userCollections}
            {article}
            class="top-10"
            btnClass="pb-2"
          >
            <Fa
              icon={faStar}
              class="
              hover:text-primary-500
              transition-colors
              text-white/90 text-4xl
            "
            />
          </CollectionList>
        </div>
      {/if}
    </svelte:fragment>
  </Large>
</Link>
