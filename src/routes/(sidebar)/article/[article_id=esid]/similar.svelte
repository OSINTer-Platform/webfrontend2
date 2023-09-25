<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";

  import ArticleCarousel from "$com/articleCarousel.svelte";
  import Fa from "svelte-fa/src/fa.svelte";

  import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { showSimilar } from "$state/storedArticles";
  import { PUBLIC_API_BASE } from "$env/static/public";

  let open: boolean = false;

  export let article: ArticleBase;

  let similarArticles: ArticleBase[] = [];

  onMount(async () => {
    if (!browser) return;

    const r = await fetch(
      `${PUBLIC_API_BASE}/articles/${encodeURIComponent(article.id)}/similar`
    );

    if (r.ok) {
      similarArticles = await r.json();
    } else {
      console.error(`${r.status} error when loading similar articles.`);
    }

    if ($showSimilar) setTimeout(() => (open = true), 500);
  });
</script>

{#if similarArticles.length > 0}
  <aside class="relative mb-8 sm:mb-0">
    {#if open}
      <main
        transition:slide|local
        class="
        bg-surface-400/30
        dark:bg-surface-900

        dark:border-b
        dark:border-surface-400

        sm:px-14
        p-6
      "
      >
        <h3 class="mb-4 text-xl sm:text-2xl dark:text-white">
          Related articles:
        </h3>
        <ArticleCarousel {similarArticles} />
      </main>
    {/if}
    <button
      class="w-full py-4 absolute -bottom-12"
      on:click={() => {
        open = !open;
        showSimilar.set(open);
      }}
    >
      <Fa
        icon={faCaretUp}
        class="
        mx-auto
        text-xl dark:text-white
        {open ? '' : '-rotate-180'}
        transition-transform
        duration-500
      "
      />
    </button>
  </aside>
{/if}
