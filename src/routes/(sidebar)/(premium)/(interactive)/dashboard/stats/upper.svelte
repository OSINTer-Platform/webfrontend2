<script lang="ts">
  export let lists: Array<{
    title: string;
    items: Array<{
      title: string;
      description: string;
      score: number;
      large: boolean;
      href?: string;
    }>;
  }>;
</script>

{#each lists as { title, items }}
  <section
    class="
      flex flex-col
      h-full px-6
      overflow-hidden
      first:pl-2 last:pr-2
  "
  >
    <h3 class="font-bold dark:text-white text-2xl mb-3">{title}</h3>
    <ol class="h-full flex flex-col gap-2 overflow-y-auto">
      {#each items as { title, description, score, large, href }}
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={href ?? "#"}
            class="
              block pb-1
              bg-surface-300/10 rounded-b-xl

              hover:bg-surface-300/20
              transition-color duration-300
            "
          >
            <div
              style="width: {score * 100}%"
              class="
              bg-primary-500 h-1 rounded-full
            "
            />
            <p
              class:flex={large}
              class="text-black/80 dark:text-white/80 flex-col mx-2 mt-1"
            >
              {title}
              {large ? "" : " | "}
              <span
                class="
                font-light text-black/60 dark:text-white/60
              ">{description}</span
              >
            </p>
          </a>
        </li>
      {/each}
    </ol>
  </section>
{/each}

<style lang="postcss">
  ol {
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
