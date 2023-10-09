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
  {#each articles as { id, title, description }}
    <ModalLink articleId={id} articleList={articles} title={description}>
      <li
        class="
          w-full p-4
          border border-primary-500
          dark:text-white leading-6
          truncate

          hover:bg-primary-400/20
        "
      >
        {title}
      </li>
    </ModalLink>
  {/each}
</ul>
