<script lang="ts">
  import type { Article, ArticleCategories } from "$shared/types/api";
  import Modal from "./modal.svelte";
  import ArticleRender from "$com/articleRender/main.svelte";

  import { spawnArticleModal } from "$lib/common/state";
  import { fly } from "svelte/transition";
  import { quintInOut } from "svelte/easing";
  import { modalState } from "$shared/state/state";
  import { goto } from "$app/navigation";

  export let article: Article;
  export let articleCategories: ArticleCategories;
  export let articleList: Array<{ id: string }>;

  let switchDirection: "left" | "right" = "left";
  let blockSwitching: boolean = false;

  async function handleKeypress(keyName: string) {
    if (keyName !== "ArrowRight" && keyName !== "ArrowLeft") return;

    if (articleList.length < 2) return;

    const currentArticleNr = articleList.map((a) => a.id).indexOf(article.id);
    if (currentArticleNr < 0) return;

    let newArticleId: string = article.id;
    if (keyName === "ArrowLeft") {
      newArticleId = articleList[currentArticleNr - 1].id;
      switchDirection = "left";
    } else if (keyName === "ArrowRight") {
      newArticleId = articleList[currentArticleNr + 1].id;
      switchDirection = "right";
    }

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
        $modalState = { modalType: null, modalContent: null };
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
    <article
      class="
		bg-surface-100
		dark:bg-surface-800

		py-8
		px-16
		mx-auto

		max-w-[100ch]
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
    </article>
  {/key}
</Modal>

<style lang="postcss">
</style>
