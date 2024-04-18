<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";

  import { cleanUp, mountCVEPreview } from "./cves";
  import { MDtoToC } from "$lib/common/ToC";
  import { onDestroy } from "svelte";

  import type { ParsedEvent, HeadingList } from "$lib/common/ToC";
  import type { FullArticle } from "$shared/types/api";

  export let article: FullArticle;
  export let headings: HeadingList = [];

  function handleParsed(e: ParsedEvent) {
    headings = MDtoToC(e);
    mountCVEPreview();
  }

  function preParse(text: string) {
    return text.replaceAll(
      /(\s)[cC][vV][eE]-([0-9]{4}-[0-9]{4,9})([\s.,\?!])/g,
      "$1[CVE-$2](/cve/CVE-$2)$3"
    );
  }

  onDestroy(cleanUp);
</script>

<div class="article-content-render text-justify">
  <SvelteMarkdown
    source={preParse(article.formatted_content)}
    on:parsed={handleParsed}
  />
</div>
