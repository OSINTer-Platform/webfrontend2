<script lang="ts">
  export let checked: boolean = false;
  export let size: "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl" = "base";
  export let name: string = "";
</script>

<label class="group relative flex items-center cursor-pointer text-{size}">
  <input
    type="checkbox"
    class="peer hidden"
    bind:checked
    on:change
    {name}
    id={name}
  />
  <span
    class="
		flex items-center
		p-[0.1875em] h-[1.5em] w-[2.25em]
		rounded-full bg-tertiary-400 dark:bg-surface-600 dark:border dark:border-white/25
		duration-300 ease-in-out

		after:h-[1.125em] after:w-[1.125em]
		after:rounded-full after:bg-white after:shadow-md
		after:duration-300

		group-hover:after:translate-x-[0.1875em]
		peer-checked:after:translate-x-[0.75em]
		peer-checked:bg-primary-500
	"
  />
  <slot />
</label>
