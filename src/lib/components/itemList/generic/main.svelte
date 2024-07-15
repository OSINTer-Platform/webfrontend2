<script lang="ts">
  import Fa from "svelte-fa";
  import ListElement from "./layouts/main.svelte";
  import Limiter from "../limiter.svelte";
  import Wrapper from "../wrapper.svelte";

  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

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
</script>

<Wrapper empty={items.length < 1} {emptyMessage} class={containerClass}>
  <Limiter list={items} {listLenLimit} let:listElement>
    {@const actions = listElement.actions}
    <a href={listElement.href} data-sveltekit-preload-data="tap">
      <ListElement
        title={listElement.title}
        description={listElement.description}
        leftLegend={listElement.leftLegend}
        rightLegend={listElement.rightLegend}
        tags={listElement.tags}
        read={listElement.read}
        imageUrl={listElement.imageUrl}
        textExpands={listElement.textExpands}
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
                on:click={() => actions[0].action(listElement.id)}
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
              <button
                on:click={() => action(listElement.id)}
                class="btn px-2"
                {title}
              >
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
  </Limiter>
</Wrapper>
