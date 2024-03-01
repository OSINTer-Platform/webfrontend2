<script lang="ts">
  import type { PageData } from "./$types";

  import { beforeNavigate } from "$app/navigation";
  import { contactEmail } from "$shared/config";
  import { onMount, onDestroy } from "svelte";

  export let data: PageData;

  let interval: ReturnType<typeof setInterval>;

  function parseDate(d: Date) {
    const hourDiff =
      Math.abs(new Date().getTime() - d.getTime()) * 1000 * 60 * 60;
    if (hourDiff < 48) {
      return `in ${hourDiff} hours`;
    } else {
      return `on ${d.toLocaleString()}`;
    }
  }

  beforeNavigate(async ({ cancel, type }) => {
    if (type !== "leave") cancel();
  });

  onMount(() => {
    interval = setInterval(() => {
      location.reload();
    }, 5000 * 60);
  });

  onDestroy(() => clearInterval(interval));
</script>

<main class="bg-surface-50 dark:bg-surface-800 h-full flex justify-center">
  <div class="flex flex-col max-w-5xl p-4 sm:p-16 md:p-8 m-auto text-center">
    <h1 class="font-semibold sm:text-4xl md:text-6xl dark:text-white">
      We are under maintenance
    </h1>

    <p class="mx-6 font-light md:text-xl dark:text-white">
      OSINTer is currently offline for maintenance purposes
    </p>

    {#if data.etc}
      <p class="mx-6 font-light text-sm md:text-lg dark:text-white">
        Expect us to be back {parseDate(data.etc)}
      </p>
    {/if}

    <section class="flex gap-4 mt-20 max-w-2xl sm:mx-auto w-full">
      <a
        href={`mailto:${contactEmail}`}
        class="
          sm:p-7 grow
          font-bold text-primary-500
          border border-primary-500
      ">Contact us</a
      >
    </section>
  </div>
</main>
