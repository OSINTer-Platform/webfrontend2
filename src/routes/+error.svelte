<script lang="ts">
  import LogoFull from "$assets/LogoFull.svelte";

  import { page } from "$app/stores";
  import { contactEmail } from "$shared/config";

  $: title = $page.error?.title ?? `${$page.status}: ${$page.error?.message}`;

  $: description =
    $page.error?.description ??
    "We're sorry, something went wrong. If the error persist, please contact the system administrator responsible for this instance.";

  $: actions = $page.error?.actions ?? [
    { title: "Contact us", href: `mailto:${contactEmail}` },
    { title: "Go back", action: () => history.back() },
  ];

  $: logo = $page.error?.logo ?? true;
</script>

<main class="bg-surface-50 dark:bg-surface-800 h-full flex justify-center">
  <div class="flex flex-col max-w-3xl p-4 sm:p-16 md:p-8 m-auto text-center">
    {#if logo}
      <LogoFull class="mb-4 mx-8 sm:mx-0" />
    {/if}

    <h1 class="font-semibold sm:text-2xl md:text-4xl dark:text-white">
      {title}
    </h1>
    {#if Array.isArray(description)}
      {#each description as desc}
        <p class="description">{desc}</p>
      {/each}
    {:else}
      <p class="description">{description}</p>
    {/if}

    <section class="mt-20 max-w-2xl sm:mx-auto w-full">
      {#each actions as { title, action, href }}
        {#if action}
          <button class="btn" on:click={action}>{title}</button>
        {:else if href}
          <a class="btn" {href}>{title}</a>
        {/if}
      {/each}
    </section>
  </div>
</main>

<style lang="postcss">
  p.description {
    @apply font-light mx-6
    text-sm md:text-lg dark:text-white;
  }

  section {
    @apply flex gap-4;
    * {
      @apply p-4 sm:p-7 grow
      font-bold text-primary-500
      border border-primary-500;
    }
  }
</style>
