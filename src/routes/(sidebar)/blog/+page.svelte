<script lang="ts">
  import { config } from "$shared/config";
  import type { PageData } from "./$types";
  import FullLogo from "$assets/fullLogo.png";
  export let data: PageData;
</script>

<svelte:head>
  <title>OSINTer Blog</title>
  <meta property="og:title" content="The OSINTer Blog" />
  <meta
    property="og:description"
    content="Keep up with the latest news, releases and improvements for OSINTer, delivered straight to you from the OSINTer core developement team."
  />
  <meta property="og:image" content={config.images.fullLogo} />
  <meta property="og:url" content="https://osinter.dk/blog" />
  <meta property="og:type" content="website" />
</svelte:head>

<div
  class="
	mx-auto
	max-w-7xl

	px-6
	py-12
	sm:py-16
	sm:px-12
"
>
  <h1 class="md:text-4xl text-3xl font-medium mb-2 dark:text-white">
    The blog for the OSINTer project
  </h1>
  <p class="md:text-lg font-light dark:text-white">
    Keep up with the latest news, releases and improvements for OSINTer,
    delivered straight to you from the OSINTer core developement team.
  </p>
  <hr class="border-surface-300 my-8" />

  <section class="flex flex-col gap-6">
    {#each data.postList as post}
      {@const readableDate = post.date.toLocaleDateString("en-DK", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}

      <a
        href={post.route}
        class="
			block

			p-3
			md:p-6

			hover:bg-surface-200
			dark:hover:bg-surface-500
		"
      >
        <article
          class="
				grid
				grid-cols-1
				lg:grid-cols-[auto_1fr]

				gap-4
				lg:gap-8
			"
        >
          <img
            src={post.image ?? FullLogo}
            alt="Article description"
            class="
					aspect-video
					object-cover
					max-h-full
					w-full
					lg:max-w-sm

					shadow-lg

				"
          />
          <div class="md:py-4 md:flex flex-col justify-between">
            <div class="dark:text-white">
              <time class="text-sm font-light">{readableDate}</time>
              <h2 class="md:text-3xl text-2xl font-semibold mt-2">
                {post.title}
              </h2>
              <p class="md:text-lg font-light">
                {post.description}
              </p>
            </div>
            <span
              class="text-sm font-bold opacity-40 capitalize dark:text-white"
              >{post.author}</span
            >
          </div>
        </article>
      </a>
    {/each}
  </section>
</div>
