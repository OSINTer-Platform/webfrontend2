<script lang="ts">
  export let options: { [key: string]: string };

  $: formName = Object.entries(options)
    .map(([name, value]) => value)
    .join("-");

  export let selected: string;
</script>

<div class="flex gap-2">
  {#each Object.entries(options) as [name, value]}
    <label
      class="
			px-4 py-2
			rounded-t-md

			cursor-pointer

			transition-colors
			hover:bg-primary-400/20

			border-primary-500

			dark:text-white
			dark:hover:bg-primary-500/40

		"
      class:border-b-4={value == selected}
    >
      <input
        type="radio"
        bind:group={selected}
        name={formName}
        {value}
        class="hidden"
      />
      {name}
    </label>
  {/each}

  <slot name="end" />
</div>
