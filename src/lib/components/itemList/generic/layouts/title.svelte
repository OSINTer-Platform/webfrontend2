<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";

  export let title: { text: string; markdown: boolean };
  export let description: { text: string; markdown: boolean };

  export let leftLegend: { text: string; hover: string };
  export let rightLegend: { text: string; hover: string };

  export let tags: string[] = [];
  export let read: boolean = false;
</script>

<article
  class="
  relative
  flex items-center gap-4
  md:p-2 p-1

  border-y border-tertiary-500 dark:border-surface-400
  hover:bg-surface-50 dark:hover:bg-surface-500

  [&+article]:border-t-0
  [&:hover>aside]:flex
"
  title={tags.join(" | ")}
>
  <p
    title={leftLegend.hover}
    class="
      hidden lg:hidden
      xl:block md:block
      truncate text-xs font-light dark:font-medium
      w-1/12 shrink-0
    "
  >
    {leftLegend.text}
  </p>
  <div
    class="
      flex flex-row gap-2
      shrink grow overflow-hidden
    "
  >
    <h1
      class="
        text-sm md:text-base
        {read ? 'opacity-60' : 'font-semibold'}
        truncate shrink-0
        [&>strong]:font-semibold
        [&>strong]:text-primary-600
      "
    >
      {#if title.markdown}
        <SvelteMarkdown source={title.text} isInline />
      {:else}
        {title.text}
      {/if}
    </h1>

    <p
      class="
        {read ? 'opacity-60 font-light' : ''}
        text-xs leading-5
        md:text-sm md:leading-6
        truncate
        text-tertiary-800 dark:text-white
        [&>strong]:font-semibold
        [&>strong]:text-primary-400
      "
    >
      {#if description.markdown}
        <SvelteMarkdown source={description.text} isInline />
      {:else}
        {description.text}
      {/if}
    </p>
  </div>

  <aside
    role="presentation"
    on:click|preventDefault|stopPropagation
    on:keydown|preventDefault|stopPropagation
    class="
      absolute right-16 md:right-20 z-10
      hidden justify-center h-full
      bg-surface-50 dark:bg-surface-500
      first:[&>*]:ml-4 last:[&>*]:mr-4
    "
  >
    <slot name="icons" />
  </aside>

  <p
    title={rightLegend.hover}
    class:opacity-60={read}
    class="text-xs font-extralight shrink-0 sm:dark:font-medium"
  >
    {rightLegend.text}
  </p>
</article>
