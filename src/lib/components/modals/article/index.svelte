<script lang="ts">
  import type {
    FullArticle,
    ArticleBase,
    ArticleCategories,
  } from "$shared/types/api";
  import Modal from "../modal.svelte";
  import ArticleRender from "$com/articleRender/main.svelte";

  import { fly } from "svelte/transition";
  import { quintInOut } from "svelte/easing";
  import { goto } from "$app/navigation";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import Loader from "$com/loader.svelte";
  import Similar from "./similar.svelte";
  import { page } from "$app/stores";
  import { modalState } from "$shared/state/modals";

  export let article: FullArticle;
  export let articleCategories: ArticleCategories;
  export let articleList: Array<{ id: string }>;
  export let topModal: boolean;

  $: authorizer = $page.data.authorizeForArea;

  let similarArticles: Promise<ArticleBase[]> | null;
  $: similarArticles = $authorizer("similar") ? getSimilar(article.id) : null;

  let switchDirection: "left" | "right" = "left";
  let blockSwitching: boolean = false;
  let transitioning = false;

  async function getSimilar(articleID: string) {
    const r = await fetch(
      `${PUBLIC_API_BASE}/articles/${encodeURIComponent(articleID)}/similar`
    );
    if (r.ok) return await r.json();
    console.error("Error when querying similar articles from modal");
  }

  async function handleKeypress(e: KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

    if (articleList.length < 2) return;

    const currentArticleNr = articleList.map((a) => a.id).indexOf(article.id);
    if (currentArticleNr < 0) return;

    let newArticleId: string | undefined;
    if (e.key === "ArrowLeft") {
      newArticleId = articleList[currentArticleNr - 1]?.id;
      switchDirection = "left";
    } else if (e.key === "ArrowRight") {
      newArticleId = articleList[currentArticleNr + 1]?.id;
      switchDirection = "right";
    }

    if (!newArticleId || !topModal) return;

    const newArticle: FullArticle | null = await fetch(
      `${PUBLIC_API_BASE}/articles/${newArticleId}/content`
    ).then((r) => {
      if (!r.ok) return null;
      return r.json();
    });

    if (!newArticle) return;

    $page.data.readArticleIds.prepend(newArticle.id, true);

    modalState.update((modals) => {
      const topModal = modals.pop();
      if (!topModal) return [];

      if (topModal.modalType === "article") {
        topModal.modalContent.article = newArticle;
      }

      return [...modals, topModal];
    });
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
    if (!blockSwitching && !transitioning && topModal) {
      blockSwitching = true;
      await handleKeypress(e);
      blockSwitching = false;
    }
  }}
/>

<Modal
  border={false}
  class="w-[80vw] h-[90vh] bg-surface-200 dark:bg-surface-700"
>
  {#key article}
    <main class="w-full h-full overflow-y-auto overflow-x-hidden">
      <article
        class="
          py-8 px-16 mx-auto max-w-[100ch]
          bg-surface-100 dark:bg-surface-800
      "
        on:outrostart={() => (transitioning = true)}
        on:introend={() => (transitioning = false)}
        in:fly={{
          delay: 100,
          duration: blockSwitching ? 200 : 0,
          easing: quintInOut,
          x: switchDirection === "right" ? 200 : -200,
        }}
        out:fly={{
          duration: blockSwitching ? 200 : 0,
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
