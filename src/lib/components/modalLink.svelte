<script lang="ts">
  import { goto } from "$app/navigation";
  import { spawnArticleModal } from "$lib/common/state";

  export let articleId: string;

  let classes: string = "";
  export { classes as class };

  const showArticleModal = (e: MouseEvent) => {
    const small = window.matchMedia(
      "only screen and (max-width: 60rem)"
    ).matches;
    if (small || e.ctrlKey) {
      return;
    }

    e.preventDefault();

    spawnArticleModal(articleId);
  };
</script>

<a
  on:click={(e) => showArticleModal(e)}
  on:contextmenu|preventDefault={() => goto(`/article/${articleId}`)}
  data-sveltekit-preload-data="off"
  href={`/article/${articleId}`}
  class={classes}
>
  <slot />
</a>
