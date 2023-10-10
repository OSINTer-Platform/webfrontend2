<script lang="ts">
  import type { ArticleCategories } from "$shared/types/api";
  import type { Writable } from "svelte/store";

  export let articleCategories: ArticleCategories;
  export let selectedSources: Writable<string[]>;
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
    >
      <input
        name="source-selection"
        type="checkbox"
        bind:group={$selectedSources}
        value={profile}
        class="
            w-4 h-4 aspect-square

            bg-transparent
            checked:bg-primary-500/50
            focus:bg-transparent
            checked:focus:bg-primary-500/50

            focus:ring-0
            focus:shadow-none
            focus:ring-offset-0

            rounded-sm

            form-checkbox
          "
      />

      <span class="font-normal text-sm text-black/60 dark:text-white"
        >{name}</span
      >
    </label>
  {/each}
</div>
