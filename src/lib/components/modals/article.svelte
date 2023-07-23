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

  export let article: Article;
  export let articleCategories: ArticleCategories;

  async function handleKeypress(keyName: string) {
    if (keyName !== "ArrowRight" && keyName !== "ArrowLeft") return;

    const articles: ArticleBase[] = $page.data.articles;
    if (!articles) return;

    const currentArticleNr = articles.map((a) => a.id).indexOf(article.id);
    if (currentArticleNr < 0) return;

    let newArticleId: string = article.id;
    if (keyName === "ArrowLeft")
      newArticleId = articles[currentArticleNr - 1].id;
    if (keyName === "ArrowRight")
      newArticleId = articles[currentArticleNr + 1].id;

    spawnArticleModal(newArticleId);
  }
</script>

<svelte:window on:keydown={(e) => handleKeypress(e.key)} />

<Modal class="w-[80vw] h-[90vh] bg-surface-200 dark:bg-surface-700">
  <article
    class="
		bg-surface-100
		dark:bg-surface-800

		py-8
		px-16
		mx-auto

		max-w-[100ch]
	"
  >
    <ArticleRender {article} {articleCategories} header={true} />
  </article>
</Modal>

<style lang="postcss">
</style>
