<script lang="ts">
  import type { PageData } from "./$types";

  import FilterShell from "$com/article-list/filter.svelte";
  import Fa from "svelte-fa";

  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
  import { similarSearch } from "$shared/state/storedArticles";

  export let data: PageData;
</script>

<FilterShell articles={data.articles} search={$similarSearch}>
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
</FilterShell>
