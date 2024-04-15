<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  import { page } from "$app/stores";

  import Large from "./large.svelte";
  import Title from "./title.svelte";

  export let title: { text: string; markdown: boolean };
  export let description: { text: string; markdown: boolean };

  export let leftLegend: { text: string; hover: string };
  export let rightLegend: { text: string; hover: string };

  export let tags: string[] = [];
  export let read: boolean = false;

  export let imageUrl: string | undefined = undefined;

  export let textExpands: {
    title: string;
    icon: IconDefinition;
    content: string;
    expanded: boolean;
    markdown: boolean;
  }[] = [];

  $: renderMode = $page.data.settings.listRenderMode;
</script>

{#if $renderMode === "large"}
  <hr class="my-4 border-tertiary-500 dark:border-surface-500" />

  <Large
    {title}
    {description}
    {leftLegend}
    {rightLegend}
    {tags}
    {read}
    {imageUrl}
    {textExpands}
  >
    <svelte:fragment slot="icons">
      <slot name="large-icons" />
    </svelte:fragment>
  </Large>
{:else if $renderMode === "title"}
  <Title {title} {description} {leftLegend} {rightLegend} {tags} {read}>
    <svelte:fragment slot="icons">
      <slot name="title-icons" />
    </svelte:fragment>
  </Title>
{/if}
