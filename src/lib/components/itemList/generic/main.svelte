<script lang="ts">
  import Fa from "svelte-fa";
  import ListElement from "./layouts/main.svelte";
  import Loader from "../loader.svelte";

  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  import { listElementCount } from "$shared/state/state";
  import { onDestroy } from "svelte";
  import Wrapper from "../wrapper.svelte";

  export let listLenLimit = 100;
  export let emptyMessage: { title: string; description: string } | null = null;
  export let containerClass: string = "";

  export let items: {
    id: string;
    href: string;

    title: { text: string; markdown: boolean };
    description: { text: string; markdown: boolean };

    leftLegend: { text: string; hover: string };
    rightLegend: { text: string; hover: string };

    tags?: string[];
    read?: boolean;

    imageUrl?: string;

    textExpands?: {
      title: string;
      icon: IconDefinition;
      content: string;
      expanded: boolean;
      markdown: boolean;
    }[];

    actions?: {
      action: (id: string) => void;
      icon: IconDefinition;
      title: string;
    }[];
  }[];

  let chunksVisible = 1;

  $: limitedItems =
    listLenLimit > 0 ? items.slice(0, listLenLimit * chunksVisible) : items;

  $: showLoader = limitedItems.length < items.length;

  $: listElementCount.set(items.length);

  onDestroy(() => listElementCount.set(0));
</script>

<Wrapper empty={items.length < 1} {emptyMessage} class={containerClass}>
  {#each limitedItems as { id, href, title, description, leftLegend, rightLegend, tags, read, imageUrl, textExpands, actions }}
    <a {href} data-sveltekit-preload-data="tap">
      <ListElement
        {title}
        {description}
        {leftLegend}
        {rightLegend}
        {tags}
        {read}
        {imageUrl}
        {textExpands}
      >
        <svelte:fragment slot="large-icons">
          {#if actions && actions.length > 0}
            <div
              class="
              flex justify-center items-center
              h-full w-full
              bg-black/75 opacity-0
              rounded-md

              transition-opacity

              [&:focus-within>button>svg]:text-primary-500
            "
            >
              <button
                class="pb-2"
                on:click={() => actions[0].action(id)}
                title={actions[0].title}
              >
                <Fa
                  icon={actions[0].icon}
                  class="
                  hover:text-primary-500
                  transition-colors
                  text-white/90 text-4xl
                "
                />
              </button>
            </div>
          {/if}
        </svelte:fragment>

        <svelte:fragment slot="title-icons">
          {#if actions}
            {#each actions as { action, icon, title }}
              <button on:click={() => action(id)} class="btn px-2" {title}>
                <Fa
                  {icon}
                  class="
                  ml-auto my-auto
                  text-lg md:text-xl
                  text-black/75 dark:text-white/90
                  hover:text-primary-500
                  transition-colors
                "
                />
              </button>
            {/each}
          {/if}
        </svelte:fragment>
      </ListElement>
    </a>
  {/each}

  {#if showLoader}
    <Loader bind:chunksVisible />
  {/if}
</Wrapper>
