<script lang="ts">
  import type { ArticleCategories } from "$shared/types/api";

  export let articleCategories: ArticleCategories;
  export let selected: string[];
  export let hovering: string;
</script>

<div class="overflow-auto">
  {#each Object.entries(articleCategories) as [profile, { name }]}
    <label
      class="
        flex items-center p-1 gap-2
        cursor-pointer
        font-light dark:font-normal

        hover:bg-primary-500/20
        [&:hover>input]:bg-primary-500/20
        [&:hover>input:checked]:bg-primary-600/75
      "
      on:mouseenter={() => (hovering = profile)}
      on:mouseleave={() => (hovering = "")}
    >
      <input
        name="source-selection"
        type="checkbox"
        bind:group={selected}
        value={profile}
        class="w-4 checkbox"
      />

      <span class="font-normal text-sm text-black/60 dark:text-white/60">
        {name}
      </span>
    </label>
  {/each}
</div>
