<script lang="ts">
  import Loader from "$com/loader.svelte";

  type MaybePromise<T> = T | Promise<T>;

  export let lists: Array<{
    title: string;
    items: MaybePromise<
      {
        title: string;
        description: string;
        score: number;
        large: boolean;
        href: string;
        action?: () => void;
      }[]
    >;
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
    <h3 class="font-bold text-2xl mb-3">{title}</h3>
    {#await items}
      <Loader text="Loading items" />
    {:then items}
      <ol class="h-full flex flex-col gap-2 overflow-y-auto">
        {#each items as { title, description, score, large, href, action }}
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              {href}
              on:click={(e) => {
                if (action) {
                  e.preventDefault();
                  action();
                }
              }}
              on:contextmenu|preventDefault={() => window.open(href, "_blank")}
              data-sveltekit-preload-data="off"
              class="
                block pb-1
                bg-surface-400/10 dark:bg-surface-400/20

                hover:bg-surface-400/20 dark:hover:bg-surface-300/20
                transition-color duration-300
              "
            >
              <div
                style="width: {score * 100}%"
                class="
                bg-primary-500 h-1
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
    {/await}
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
