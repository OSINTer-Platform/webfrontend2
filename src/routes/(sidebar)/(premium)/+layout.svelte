<script lang="ts">
  import { page } from "$app/stores";

  $: premium = $page.data.user.premium > 0;

  const descriptions = [
    "We are at OSINTer currently beta-testing new features",
    "Do you want early access?",
    "Contact us below",
  ];
</script>

{#if premium}
  <slot />
{:else}
  <main class="w-full h-full bg-surface-100 dark:bg-surface-800">
    <div
      class="h-full mx-auto px-8 xl:max-w-5xl max-w-2xl flex flex-col justify-center text-center dark:text-white"
    >
      <h2
        class="xl:text-4xl md:text-3xl sm:text-2xl text-2xl font-bold md:mb-2"
      >
        This page is reserved for beta-testers and B2B partners.
      </h2>

      {#each descriptions as description}
        <p class="xl:text-xl md:text-lg font-light md:tracking-tighter">
          {description}
        </p>
      {/each}

      <section class="mt-20 max-w-2xl mx-auto w-full">
        <a class="btn" href="mailto:contact@osinter.dk">Contact us</a>
        <button class="btn" on:click={() => history.back()}>Go back</button>
      </section>
    </div>
  </main>
{/if}

<style lang="postcss">
  section {
    @apply flex gap-4;
    * {
      @apply p-7 grow
      font-bold text-primary-500
      border border-primary-500;
    }
  }
</style>
