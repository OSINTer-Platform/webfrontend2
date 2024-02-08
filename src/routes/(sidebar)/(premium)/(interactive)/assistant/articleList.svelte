<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";

  import ModalLink from "$com/modalLink.svelte";

  export let articles: ArticleBase[];
  let classes: string = "";

  export { classes as class };
</script>

<ul
  class="
    flex flex-col gap-4
    {classes}
  "
>
  {#each articles as article (article.id)}
    <ModalLink {article} articleList={articles} title={article.description}>
      <li
        class="
          w-full p-4
          border border-primary-500
          dark:text-white leading-6
          truncate

          hover:bg-primary-400/20
        "
      >
        {article.title}
      </li>
    </ModalLink>
  {/each}
</ul>
