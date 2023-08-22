<script lang="ts">
  import type {
    Article,
    ArticleBase,
    ArticleCategories,
  } from "$shared/types/api";
  import Modal from "./modal.svelte";
  import ArticleRender from "$com/articleRender/main.svelte";
  import { page } from "$app/stores";
  import { spawnArticleModal } from "$lib/common/state";

  import { fly } from "svelte/transition";
  import { quintInOut } from "svelte/easing";
  import { modalState } from "$shared/state/state";

  export let article: Article;
  export let articleCategories: ArticleCategories;

  let switchDirection: "left" | "right" = "left";

  async function handleKeypress(keyName: string) {
    if (keyName !== "ArrowRight" && keyName !== "ArrowLeft") return;

    const articles: ArticleBase[] = $page.data.articles;
    if (!articles) return;

    const currentArticleNr = articles.map((a) => a.id).indexOf(article.id);
    if (currentArticleNr < 0) return;

    let newArticleId: string = article.id;
    if (keyName === "ArrowLeft") {
      newArticleId = articles[currentArticleNr - 1].id;
      switchDirection = "left";
    } else if (keyName === "ArrowRight") {
      newArticleId = articles[currentArticleNr + 1].id;
      switchDirection = "right";
    }

    spawnArticleModal(newArticleId);
  }
</script>

<svelte:window on:keydown={(e) => handleKeypress(e.key)} />

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
      <ArticleRender {article} {articleCategories} header={true} />
    </article>
  {/key}
</Modal>

<style lang="postcss">
</style>
