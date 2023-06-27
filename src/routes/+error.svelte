<script lang="ts">
  import { page } from "$app/stores";
  import LogoFull from "$assets/LogoFull.svelte";
</script>

<main class="bg-surface-50 dark:bg-surface-800 h-full flex justify-center">
  <div class="flex flex-col max-w-2xl p-4 sm:p-16 md:p-8 m-auto text-center">
    <LogoFull class="mb-4 mx-8 sm:mx-0" />

    <h1 class="font-semibold sm:text-xl md:text-2xl dark:text-white">
      {$page.status}: {$page.error?.message}
    </h1>
    <p class="font-light mx-6 text-sm sm:text-base dark:text-white">
      We're sorry, something went wrong. If the error persists, please contact
      the system administrator responsible for the instance.
    </p>
  </div>
</main>
