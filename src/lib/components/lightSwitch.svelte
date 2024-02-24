<script lang="ts">
  import { page } from "$app/stores";
  import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  $: darkMode = $page.data.settings.darkMode;
</script>

<label
  title="Toggle dark/light mode"
  class="group relative flex items-center cursor-pointer text-lg"
>
  <input
    type="checkbox"
    class="peer hidden"
    bind:checked={$darkMode}
    on:change
  />
  <span
    class="
		flex items-center mx-4
		p-[0.1875em] h-[1.5em] w-[2.25em]
		rounded-full bg-tertiary-400 dark:bg-surface-600 dark:border dark:border-white/25
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
      {$darkMode ? 'bg-white' : 'bg-black'}
  "
      class:text-white={!$darkMode}
    >
      <Fa icon={$darkMode ? faMoon : faSun} class="text-sm" />
    </div>
  </span>
</label>
