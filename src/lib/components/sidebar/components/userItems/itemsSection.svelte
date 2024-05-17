<script lang="ts">
  import LinkNavOptions from "../linkNav/optionList.svelte";
  import Fa from "svelte-fa";

  import type { SidebarOption } from "$shared/types/internal";

  import { faPlus } from "@fortawesome/free-solid-svg-icons";

  export let options: SidebarOption;
  export let additionButton: undefined | { text: string; create: () => void } =
    undefined;
</script>

<LinkNavOptions {options}>
  <svelte:fragment slot="bottom">
    {#if additionButton}
      <div class="px-4">
        <button
          on:click={additionButton.create}
          class="
          mt-2 sm:mb-6 w-full
          sm:px-4 sm:py-2 px-2 py-1
          grid grid-cols-[auto_1fr] items-center

          sm:text-base text-sm
          text-left text-black/30 dark:text-white/30

          border border-surface-400/30 sm:rounded-xl rounded-md
          hover:border-surface-400 hover:dark:text-white/80 hover:text-black/80
          transition-colors duration-300
        "
        >
          <Fa icon={faPlus} class="sm:mr-4 mr-2" />
          <span
            class="
            w-full
            sm:pl-4 pl-2

            border-l border-surface-400/30
            hover:border-surface-400

            transition-colors duration-300
          "
          >
            {additionButton.text}
          </span>
        </button>
      </div>
    {/if}
  </svelte:fragment>
</LinkNavOptions>
