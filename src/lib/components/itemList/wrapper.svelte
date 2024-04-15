<script lang="ts">
  let defaultMessage: {
    title: string;
    description: string;
  } = {
    title: "Well, it looks rather empty here.",
    description:
      "Try using another feed or collection, or contact your system administrator if you believe this is an error",
  };

  export let emptyMessage: typeof defaultMessage | null = null;
  export let empty: boolean;

  let classes: string = "";
  export { classes as class };
</script>

<div
  class="
	grow
	p-4 sm:p-12
	bg-surface-100 dark:bg-surface-900
  {classes}
"
>
  {#if !empty}
    <slot />
  {:else}
    <div
      class="h-full mx-auto px-8 max-w-2xl flex flex-col justify-center text-center"
    >
      <h2 class="md:text-4xl sm:text-3xl text-2xl font-bold md:mb-2">
        {emptyMessage?.title ?? defaultMessage.title}
      </h2>
      <p class="md:text-xl sm:text-lg font-light md:tracking-tighter">
        {emptyMessage?.description ?? defaultMessage.description}
      </p>
    </div>
  {/if}
</div>
