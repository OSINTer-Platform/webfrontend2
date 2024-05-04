<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";

  import { cleanUp, mountCVEPreview } from "./cves";
  import { MDtoToC } from "$lib/common/ToC";
  import { onDestroy } from "svelte";

  import type { ParsedEvent, HeadingList } from "$lib/common/ToC";
  import type { FullArticle } from "$shared/types/api";

  export let article: FullArticle;
  export let headings: HeadingList = [];

  $: containerId = `article-content-${article.id}`;

  function handleParsed(e: ParsedEvent) {
    headings = MDtoToC(e);
    mountCVEPreview(`#${containerId}`);
  }

  function preParse(text: string) {
    return text.replaceAll(
      /[cC][vV][eE]-([0-9]{4}-[0-9]{4,9})/g,
      "[CVE-$1](/cve/CVE-$1)"
    );
  }

  onDestroy(cleanUp);
</script>

<div id={containerId} class="article-content-render text-justify">
  <SvelteMarkdown
    source={preParse(article.formatted_content)}
    on:parsed={handleParsed}
  />
</div>
