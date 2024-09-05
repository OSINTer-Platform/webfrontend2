<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let checked: boolean = false;
  export let size: "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl" = "base";
  export let name: string = "";
  export let containerClass: string = "";
  export let bgClass: string = "";
  export let iconClass: string = "";
  export let title: string = "";
  export let value: string = "true";
  export let disabled = false;

  export let icons: null | { off: IconDefinition; on: IconDefinition } = null;
</script>

<label
  {title}
  class="
    group relative flex items-center
    text-{size} {containerClass}
    {disabled ? 'saturate-50 opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  "
>
  <input
    {disabled}
    type="checkbox"
    class="peer hidden"
    bind:checked
    on:change
    {value}
    {name}
    id={name}
  />
  <span
    class="
		flex items-center
		p-[0.1875em] h-[1.5em] w-[2.25em]
		rounded-full

    bg-surface-300 dark:bg-surface-600
    dark:border dark:border-white/25
		duration-300 ease-in-out

		peer-checked:bg-primary-500
    group-hover:[&>div]:translate-x-[0.1875em]
    peer-checked:[&>div]:translate-x-[0.75em]
	"
  >
    <div
      class="
      flex justify-center items-center
      absolute h-[1.125em] w-[1.125em]
      rounded-full shadow-md
		  duration-300 z-10
      bg-white {bgClass}
      dark:text-black
  "
    >
      {#if icons}
        <Fa
          icon={checked ? icons.on : icons.off}
          class="w-3/4 aspect-square {iconClass}"
        />
      {/if}
    </div>
  </span>

  <slot />
</label>
