<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import type { PageData } from "./$types";
  import FullLogo from "$assets/fullLogo.png";
  export let data: PageData;

  $: readableDate = data.currentPost.date.toLocaleString();
</script>

<svelte:head>
  <meta
    property="article:published_time"
    content={data.currentPost.date.toISOString()}
  />
  <meta property="article:author" content={data.currentPost.author} />
</svelte:head>

<article
  class="
	flex
	flex-col

	min-h-full

	!max-w-4xl
	m-auto

	p-4
	sm:p-12

	prose
	prose-sm
	md:prose
	dark:prose-invert
	dark:md:prose-invert

	prose-h1:font-bold
	prose-h1:text-5xl

	prose-hr:border-surface-300

"
>
  <span class="not-prose">
    <div
      class="
			flex
			justify-between
			mb-6

			text-surface-400
			italic
			text-sm
		"
    >
      <p>{data.currentPost.author}</p>
      <time>{readableDate}</time>
    </div>

    <h1 class="md:font-bold md:text-5xl md:text-justify text-4xl font-semibold">
      {data.currentPost.title}
    </h1>
    <p class="text-lg font-light italic mb-8">
      {data.currentPost.description}
    </p>

    {#if data.currentPost.image}
      <img src={data.currentPost.image} alt="Article description" />
    {:else}
      <img
        src={FullLogo}
        alt="Article description"
        class="aspect-[2/1] w-full object-cover"
      />
    {/if}
  </span>

  <SvelteMarkdown source={data.currentPost.content} />
</article>
