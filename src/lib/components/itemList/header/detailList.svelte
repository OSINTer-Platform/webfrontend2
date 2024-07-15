<script lang="ts">
  import Detail from "./detail.svelte";

  import type { VisualDetail, VisualDetailBatch } from "./types";

  export let detailBatches: VisualDetailBatch[][];

  $: filteredOptionBatches = detailBatches
    .map((options) =>
      options.filter(
        (a): a is { title: string; content: VisualDetail; mono?: boolean } =>
          !!a.content && a.content.length > 0
      )
    )
    .filter((options) => Object.keys(options).length > 0);
</script>

<section
  class="
	grid
  grid-cols-[max-content_auto]
	overflow-hidden
"
>
  {#each { length: 2 } as _}
    <slot name="divider">
      <hr class="my-4 border-tertiary-700/50" />
    </slot>
  {/each}
  {#each filteredOptionBatches as options}
    {#each options as { title, content, mono }}
      <p
        class="
          pr-5 mb-3
          border-r border-tertiary-700/30
          text-xs sm:text-base"
      >
        {title}:
      </p>

      <Detail detail={content} mono={mono ?? false} />
    {/each}
    {#each { length: 2 } as _}
      <slot name="divider">
        <hr class="mb-4 mt-1 border-tertiary-700/50" />
      </slot>
    {/each}
  {/each}
</section>
