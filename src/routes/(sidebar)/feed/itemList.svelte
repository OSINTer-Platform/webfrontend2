<script lang="ts">
  import { modalState } from "$shared/state/modals";

  import Editable from "$com/utils/inputs/editable/editable.svelte";
  import EditableWrapper from "$com/utils/inputs/editable/wrapper.svelte";
  import Fa from "svelte-fa";

  import {
    faArrowRotateLeft,
    faBars,
    faPlus,
  } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";

  import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";

  type Item = $$Generic;
  type Action = {
    title: string;
    icon: IconDefinition;
    action: () => void;
    requireOwn: boolean;
  };

  type GlobalAction = Omit<Action, "action"> & {
    action: (items: Item[]) => Promise<boolean>;
  };

  export let title: string;
  export let items: {
    title: string;
    description: { primary: string; secondary?: string };
    href: string;
    titleEdit?: (newTitle: string) => void;
    actions: Action[];
    checked: boolean;
    own: boolean;
    item: Item;
  }[];

  export let globalActions: GlobalAction[];

  export let create: {
    text: string;
    action: () => void;
  };

  let customGlobalActions: GlobalAction[];

  let hoveredEl = -1;

  $: checkedItems = items.filter((item) => item.checked);
  $: customGlobalActions = [
    {
      title: "Clear selection",
      icon: faArrowRotateLeft,
      requireOwn: false,
      action: async () => {
        items = items.map((item) => ({ ...item, checked: false }));
        return false;
      },
    },
    ...globalActions,
  ];

  const triggerActionModal = (actions: Action[], own: boolean) =>
    modalState.append({
      modalType: "actions",
      modalContent: {
        options: actions
          .filter(({ requireOwn }) => !requireOwn || own)
          .map(({ title, icon, action }) => ({
            text: title,
            icon,
            action,
          })),
      },
    });
</script>

<section>
  <header class="flex justify-between">
    <h2 class="text-3xl sm:text-5xl">{title}</h2>
    {#if globalActions.length > 0 && checkedItems.length > 0}
      <div class="flex gap-2">
        {#each customGlobalActions as { title, icon, action, requireOwn }}
          {#if !requireOwn || !checkedItems.some(({ own }) => !own)}
            <button
              {title}
              class="btn p-2 text-lg h-10 w-10"
              on:click={() =>
                action(checkedItems.map((item) => item.item)).then((r) => {
                  if (r) {
                    items.forEach((item) => (item.checked = false));
                  }
                })}
            >
              <Fa {icon} />
            </button>
          {/if}
        {/each}
      </div>
    {/if}
  </header>

  <ul class="flex flex-col gap-4 mt-3 sm:mt-6">
    {#each items as { title, description, href, titleEdit, actions, checked, own }, i}
      <li transition:slide>
        <a
          {href}
          on:pointerenter={() => (hoveredEl = i)}
          on:pointerleave={() => (hoveredEl = -1)}
          data-sveltekit-preload-data="off"
          class="
            px-3 sm:px-6 h-[4.25rem] sm:h-20
            flex justify-between gap-4
            border border-primary-500
            bg-primary-500/20 hover:bg-primary-400/20
            dark:bg-primary-800/25 dark:hover:bg-primary-800/40
            hover:scale-[102%]
            transition-all duration-300
          "
        >
          <div class="flex flex-col justify-center min-w-0 mr-4">
            {#if titleEdit}
              <h3
                class="
                block sm:hidden
                text-xl font-bold
                max-w-max truncate
              "
              >
                {title}
              </h3>
              <EditableWrapper
                class="hidden sm:flex items-center gap-2"
                on:click={(e) => e.preventDefault()}
              >
                <Editable
                  tag="h3"
                  content={title}
                  class="text-xl sm:text-2xl font-bold max-w-max truncate link-underline "
                  on:commit={(e) => titleEdit(e.detail)}
                />
              </EditableWrapper>
            {:else}
              <h3 class="text-xl sm:text-2xl font-bold truncate">{title}</h3>
            {/if}
            <p class="font-light text-xs sm:text-base truncate">
              {description.primary}
              {#if description.secondary}
                <span class="opacity-75"> | {description.secondary}</span>
              {/if}
            </p>
          </div>
          <aside class="flex gap-4 items-center">
            {#if globalActions.some(({ requireOwn }) => !requireOwn) || own}
              {#if hoveredEl === i || checkedItems.length > 0}
                <input
                  transition:slide={{ axis: "x", duration: 150 }}
                  type="checkbox"
                  {checked}
                  on:click|preventDefault={() => {
                    setTimeout(() => (checked = !checked), 0);
                  }}
                  class="
                    checkbox hidden sm:block
                    w-12 h-12 mr-2
                    text-surface-50 dark:text-surface-900
                  "
                />
              {/if}
            {/if}
            {#each actions as { title, icon, requireOwn, action }}
              {#if !requireOwn || own}
                <button
                  on:click|preventDefault={action}
                  {title}
                  class="
                    btn hidden sm:flex
                    h-12 aspect-square
                    border border-primary-500
                    bg-surface-50 dark:bg-surface-900
                  "
                >
                  <Fa {icon} />
                </button>
              {/if}
            {/each}
            <button
              on:click|preventDefault={() => triggerActionModal(actions, own)}
              class="
              btn sm:hidden flex
              h-12 aspect-square
              border border-primary-500
              bg-surface-50 dark:bg-surface-900
            "
            >
              <Fa icon={faBars} />
            </button>
          </aside>
        </a>
      </li>
    {/each}

    <button
      on:click={create.action}
      style="--height-units: {Math.max(1, 4 - items.length)}"
      class="
      create-button
      flex flex-col justify-center items-center
      border border-dashed
      border-surface-400/50 hover:border-surface-400
      bg-surface-400/10 hover:bg-surface-400/20
      transition-colors duration-300
      font-light text-sm sm:text-base
    "
    >
      <Fa icon={faPlus} class="text-xl sm:text-2xl" />
      {create.text}
    </button>
  </ul>
</section>

<style>
  .create-button {
    height: calc(4.25rem * var(--height-units));

    @media (min-width: 640px) {
      height: calc(5rem * var(--height-units));
    }
  }
</style>
