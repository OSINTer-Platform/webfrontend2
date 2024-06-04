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

  const showArticleModal = (
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLAnchorElement;
    }
  ) => {
    if (
      e.target &&
      e.target !== e.currentTarget &&
      "tagName" in e.target &&
      e.target.tagName == "A"
    )
      return;

    if (e.ctrlKey || $renderExternal) {
      return;
    }

    e.preventDefault();

    spawnArticleModal(article.id, articleList);
  };
</script>

<a
  on:click={(e) => showArticleModal(e)}
  on:contextmenu|preventDefault={() => goto(`/article/${article.id}`)}
  data-sveltekit-preload-data="tap"
  {href}
  class={classes}
  {title}
  target={$renderExternal ? "_blank" : ""}
  rel="noopener noreferrer"
>
  <slot />
</a>
