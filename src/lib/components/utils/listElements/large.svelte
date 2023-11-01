<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import SmallLogo from "$assets/smallLogo.jpg";

  export let title: string;
  export let description: string;

  export let leftLegend: { text: string; hover: string };
  export let rightLegend: { text: string; hover: string };

  export let imageUrl: string | null = null;
  export let tags: string[] = [];
  export let read: boolean = false;
</script>

<div
  on:click|preventDefault|stopPropagation
  on:keydown|preventDefault|stopPropagation
  class="
    absolute-grid
    w-full md:w-32 max-h-80
    aspect-video md:aspect-square
    drop-shadow-lg

    [&:hover>div]:opacity-100
    hover:z-20
"
>
  <img
    class="
      w-full h-full
      object-cover
      rounded-md
    "
    loading="lazy"
    alt="OSINTer logo"
    src={SmallLogo}
  />
  {#if imageUrl}
    <img
      class="
        w-full h-full
        object-cover
        rounded-md
      "
      loading="lazy"
      alt="Article Overview"
      src={imageUrl}
    />
  {/if}

  <div
    class="
    rounded-md
    w-full h-full
    bg-surface-100/60 dark:bg-surface-900/60
    {read ? 'block' : 'hidden'}
  "
  />

  <slot name="actions" />
</div>

<div
  class="
  flex
  flex-col

  justify-center
  "
>
  <div
    class="
      flex
      flex-row
      justify-between

      font-light
      text-xs
      dark:text-white

      mb-1
    "
  >
    <p title={leftLegend.hover}>{leftLegend.text}</p>
    <time title={rightLegend.hover}>{rightLegend.text}</time>
  </div>

  <div>
    <h2
      class="
    sm:text-2xl
    text-xl
    dark:text-white

    {read ? 'opacity-75' : 'font-bold'}
    [&>strong]:font-semibold
    [&>strong]:text-primary-600
  "
    >
      <SvelteMarkdown source={title} isInline />
    </h2>

    <p
      class="
    {read ? 'font-light' : 'font-normal'}
    text-tertiary-900
    dark:text-white/80
    [&>strong]:font-semibold
    [&>strong]:text-primary-600
  "
    >
      <SvelteMarkdown source={description} isInline />
    </p>
  </div>

  {#if tags.length > 0}
    <footer class="flex flex-wrap gap-2 mt-4">
      {#each tags as tag}
        <p
          class="
          py-1 px-3 rounded-full
          shrink-0
          bg-primary-600/20 dark:bg-primary-700/30
          border border-primary-500/50
          uppercase text-xs dark:font-bold
          dark:text-white/80
        "
        >
          {tag}
        </p>
      {/each}
    </footer>
  {/if}
</div>
