<script lang="ts">
  import type { PageData } from "./$types";

  import List from "$com/article-list/wrapper.svelte";
  import Fa from "svelte-fa";

  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

  export let data: PageData;
</script>

<List
  articles={data.similarArticles}
  class="relative"
  tintReadArticles={true}
  showHighlights={false}
>
  <svelte:fragment slot="top">
    <a
      href="/article/{data.article.id}"
      class="
        my-3 sm:mb-6 sm:mt-0 pr-2
        flex items-center gap-4 w-fit
        text-base sm:text-xl
        font-light
        group
      "
    >
      <Fa class="text-black/50 dark:text-white/50" icon={faArrowLeft} />
      <span
        class="
          link-underline
          group-hover:after:scale-x-100
          group-hover:after:origin-bottom-left
        ">Go back to main article</span
      >
    </a>
  </svelte:fragment>
</List>
