<script lang="ts">
  import { goto } from "$app/navigation";
  import { spawnArticleModal } from "$lib/common/state";

  export let articleId: string;

  let classes: string = "";
  export { classes as class };
</script>

<a
  on:click={(e) => spawnArticleModal(e, articleId)}
  on:contextmenu|preventDefault={() => goto(`/article/${articleId}`)}
  data-sveltekit-preload-data="tap"
  href={`/article/${articleId}`}
  class={classes}
>
  <slot />
</a>
