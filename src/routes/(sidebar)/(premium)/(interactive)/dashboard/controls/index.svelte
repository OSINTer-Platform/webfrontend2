<script lang="ts">
  import LogoIcon from "$assets/LogoIcon.svelte";
  import DateSlider from "./dateSlider.svelte";
  import Navigator from "./navigator.svelte";

  import type { Dashboards } from "$shared/types/internal";

  import { createEventDispatcher } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import SpeedSlider from "./speedSlider.svelte";

  const dispatch = createEventDispatcher();
  export let startDate: Date;
  export let dashboard: Dashboards;
  export let scrollSpeed: number;

  function changeDate() {
    const url = new URL($page.url);
    url.searchParams.set("startDate", startDate.toISOString());
    goto(url, { replaceState: true });

    dispatch("date", { date: startDate });
  }
</script>

<aside
  class="
  absolute

  bottom-2 left-2 right-2
  sm:bottom-4 sm:left-5 sm:right-5
  xl:left-10 xl:right-10
  2xl:left-20 2xl:right-20

  flex gap-1 sm:gap-4

  [&>div]:opacity-5 [&:hover>div]:opacity-100
  [&>div]:duration-300
"
>
  <div
    class="
    flex rounded-3xl overflow-hidden shrink-0
    bg-black
  "
  >
    <a
      title="Return to homepage"
      href="/"
      class="
        btn shrink-0
        my-auto w-10 aspect-square
        text-white
      "
    >
      <LogoIcon class="h-4 w-4" />
    </a>
  </div>
  <div class="shrink grow flex gap-1 sm:gap-4">
    <SpeedSlider bind:value={scrollSpeed} />
    <DateSlider on:change={changeDate} bind:date={startDate} />
  </div>
  <Navigator {dashboard} />
</aside>
