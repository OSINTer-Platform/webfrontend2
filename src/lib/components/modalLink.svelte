<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { spawnArticleModal } from "$lib/common/state";

  export let article: { id: string; url: string };
  export let articleList: Array<{ id: string }>;

  let classes: string = "";
  export { classes as class };
  export let title: string = "";

  $: renderExternal = $page.data.settings.renderExternal;

  $: href = $renderExternal ? article.url : `/article/${article.id}`;

  const showArticleModal = (e: MouseEvent) => {
    const small = window.matchMedia(
      "only screen and (max-width: 60rem)"
    ).matches;
    if (small || e.ctrlKey || $renderExternal) {
      return;
    }

    e.preventDefault();

    spawnArticleModal(article.id, articleList);
  };
</script>

<a
  on:click={(e) => showArticleModal(e)}
  on:contextmenu|preventDefault={() => goto(`/article/${article.id}`)}
  data-sveltekit-preload-data="off"
  {href}
  class={classes}
  {title}
  target={$renderExternal ? "_blank" : ""}
  rel="noopener noreferrer"
>
  <slot />
</a>
