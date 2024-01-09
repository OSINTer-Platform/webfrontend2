<script lang="ts">
  import type { ArticleCategories } from "$shared/types/api";

  export let articleCategories: ArticleCategories;
  export let selected: string[];
  export let hovering: string;
</script>

<div
  class="
  overflow-auto
  grid grid-cols-2
"
>
  {#each Object.entries(articleCategories) as [profile, { name, image }]}
    <label
      class="
        p-2 m-2
        aspect-square

        flex flex-col justify-around items-center

        border-t-2 border-b-2
        border-primary-500/50

        even:border-l-2 odd:border-r-2

        [&:nth-child(1)]:border-t-0
        [&:nth-child(2)]:border-t-0

        cursor-pointer
        font-light dark:font-normal

        hover:bg-primary-500/20
        {selected.includes(profile)
        ? 'bg-primary-500/30 hover:bg-primary-500/40'
        : ''}

        transition-colors duration-150
      "
      on:mouseenter={() => (hovering = profile)}
      on:mouseleave={() => (hovering = "")}
    >
      <input
        name="source-selection"
        type="checkbox"
        bind:group={selected}
        value={profile}
        class="hidden"
      />

      <img
        src={image}
        alt="Source logo"
        class="w-12 aspect-square object-contain overflow-hidden drop-shadow-lg bg-white"
      />

      <span class="font-light text-center text-xs dark:text-white">{name}</span>
    </label>
  {/each}
</div>
