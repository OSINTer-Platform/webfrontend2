<script lang="ts">
  import type { HeadingList } from "$lib/common/ToC";
  import type { PageData } from "./$types";

  import ArticleRender from "$com/articleRender/main.svelte";
  import Similar from "./similar.svelte";

  export let data: PageData;
  $: article = data.article;

  let headings: HeadingList = [];
</script>

{#key data.article}
  <Similar article={data.article} />
{/key}

<section
  class="
	flex
	flex-row

	p-6
	sm:p-12
	gap-12
"
>
  <article
    class="
		flex
		flex-col

		max-w-full
		2xl:max-w-5xl
		2xl:mx-auto
		min-w-0

		overflow-x-hidden
	"
  >
    <ArticleRender bind:headings {article} header={false} />
  </article>

  {#if headings.length > 0}
    <div
      class="
			w-96
			max-h-screen
			overflow-x-auto

			shrink-0

			sticky
			top-4

			hidden
			2xl:flex
			flex-col
		"
    >
      <p
        class="
				pl-2
				font-bold
				text-lg
			"
      >
        In this article
      </p>
      {#each headings as heading}
        <a
          href="#{heading.id}"
          class="
					inline-flex items-center
					h-8 shrink-0
					px-2
					overflow-hidden truncate
					text-sm font-light
					rounded-md
					cursor-pointer
					hover:bg-primary-500/5
					ml-{3 * heading.depth}
					dark:font-medium
				"
        >
          {heading.text}
        </a>
      {/each}
    </div>
  {/if}
</section>
