<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";

  import { cleanUp, mountCVEPreview } from "./cves";
  import { MDtoToC } from "$lib/common/ToC";
  import { onDestroy, onMount } from "svelte";

  import type { HeadingList } from "$lib/common/ToC";
  import type { FullArticle } from "$shared/types/api";

  import { marked, Lexer } from "marked";

  export let article: FullArticle;
  export let headings: HeadingList = [];
  $: headings = headings ?? [];
  // See https://github.com/sveltejs/svelte/issues/11647

  let tokens: marked.Token[];
  $: tokens = convertToToken(article.formatted_content);

  $: containerId = `article-content-${article.id}`;

  function handleParsed(tokens: marked.Token[]) {
    headings = MDtoToC(tokens);
    mountCVEPreview(`#${containerId}`);
  }

  function convertToToken(text: string) {
    function walkTolkens(
      tokens: marked.Token[],
      modifier: (token: marked.Token) => {
        token: marked.Token;
        break?: boolean;
      }[]
    ): marked.Token[] {
      const finalTokens: marked.Token[] = [];
      for (const token of tokens) {
        const modifiedList = modifier(token);

        for (const modified of modifiedList) {
          if (
            !modified.break &&
            "tokens" in modified.token &&
            modified.token.tokens
          )
            modified.token.tokens = walkTolkens(
              modified.token.tokens,
              modifier
            );
          finalTokens.push(modified.token);
        }
      }
      return finalTokens;
    }

    const lexer = new Lexer();

    const tokens = lexer.lex(text);
    const tokensWithCVELinks = walkTolkens(tokens, (token) => {
      if (token.type !== "text") return [{ token }];
      else if (!/[cC][vV][eE]-([0-9]{4}-[0-9]{4,9})/.test(token.raw))
        return [{ token }];

      const newText = token.raw.replaceAll(
        /[cC][vV][eE]-([0-9]{4}-[0-9]{4,9})/g,
        '[CVE-$1](/cve/CVE-$1 "OSINTer-CVE")'
      );

      return lexer
        .inlineTokens(newText)
        .map((token) => ({ token, break: true }));
    });
    return tokensWithCVELinks;
  }

  onMount(() => {
    handleParsed(tokens);
  });
  onDestroy(cleanUp);
</script>

<div id={containerId} class="article-content-render text-justify">
  <SvelteMarkdown source={tokens} />
</div>
