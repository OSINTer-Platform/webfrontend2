<script lang="ts">
  import type {
    Article,
    ArticleBase,
    ArticleCategories,
  } from "$shared/types/api";
  import Modal from "../modal.svelte";
  import ArticleRender from "$com/articleRender/main.svelte";

  import { spawnArticleModal } from "$lib/common/state";
  import { fly } from "svelte/transition";
  import { quintInOut } from "svelte/easing";
  import { modalState } from "$shared/state/state";
  import { goto } from "$app/navigation";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import Loader from "$com/loader.svelte";
  import Similar from "./similar.svelte";
  import { page } from "$app/stores";

  export let article: Article;
  export let articleCategories: ArticleCategories;
  export let articleList: Array<{ id: string }>;

  $: premium = $page.data.user && $page.data.user.premium > 0;
  let similarArticles: Promise<ArticleBase[]> | null;
  $: similarArticles = premium ? getSimilar(article.id) : null;

  let switchDirection: "left" | "right" = "left";
  let blockSwitching: boolean = false;

  async function getSimilar(articleID: string) {
    const r = await fetch(
      `${PUBLIC_API_BASE}/articles/${encodeURIComponent(articleID)}/similar`
    );
    if (r.ok) return await r.json();
    console.error("Error when querying similar articles from modal");
  }

  async function handleKeypress(keyName: string) {
    if (keyName !== "ArrowRight" && keyName !== "ArrowLeft") return;

    if (articleList.length < 2) return;

    const currentArticleNr = articleList.map((a) => a.id).indexOf(article.id);
    if (currentArticleNr < 0) return;

    let newArticleId: string | undefined;
    if (keyName === "ArrowLeft") {
      newArticleId = articleList[currentArticleNr - 1]?.id;
      switchDirection = "left";
    } else if (keyName === "ArrowRight") {
      newArticleId = articleList[currentArticleNr + 1]?.id;
      switchDirection = "right";
    }

    if (!newArticleId) return;

    await spawnArticleModal(newArticleId, articleList);
    await new Promise((r) => setTimeout(r, 400)); // Wait for transitions
  }

  const buttonActions = [
    {
      title: "Read Article on Website",
      action: () => window.open(article.url, "_blank"),
    },
    {
      title: "Read Article on OSINTer",
      action: () => {
        goto(`/article/${article.id}`);
      },
    },
  ];
</script>

<svelte:window
  on:keydown={async (e) => {
    if (!blockSwitching) {
      blockSwitching = true;
      await handleKeypress(e.key);
      blockSwitching = false;
    }
  }}
/>

<Modal class="w-[80vw] h-[90vh] bg-surface-200 dark:bg-surface-700">
  {#key $modalState}
    <main class="w-full h-full overflow-y-auto">
      <article
        class="
          py-8 px-16 mx-auto max-w-[100ch]
          bg-surface-100 dark:bg-surface-800
      "
        in:fly|local={{
          duration: 400,
          easing: quintInOut,
          x: switchDirection === "right" ? 200 : -200,
        }}
        out:fly|local={{
          duration: 200,
          easing: quintInOut,
          x: switchDirection === "left" ? 200 : -200,
        }}
      >
        <ArticleRender
          {article}
          {articleCategories}
          header={true}
          {buttonActions}
        />

        {#if similarArticles}
          {#await similarArticles}
            <Loader text="Loading similar articles" />
          {:then articles}
            {#if articles.length > 0}
              <Similar {articles} mainArticle={article} />
            {/if}
          {/await}
        {/if}
      </article>
    </main>
  {/key}
</Modal>
