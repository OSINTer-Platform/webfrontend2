<script lang="ts">
  import DoubleSlider from "$com/utils/inputs/time/doubleSlider.svelte";
  import LogoIcon from "$assets/LogoIcon.svelte";
  import Navigator from "./navigator.svelte";

  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { createEventDispatcher } from "svelte";

  export let startDate: Date;
  export let endDate: Date;

  const dispatch = createEventDispatcher<{
    date: { startDate: Date; endDate: Date };
  }>();

  function changeDate() {
    const url = new URL($page.url);
    url.searchParams.set("startDate", startDate.toISOString());
    url.searchParams.set("endDate", endDate.toISOString());
    goto(url, { replaceState: true });

    dispatch("date", { startDate: startDate, endDate: endDate });
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
      <LogoIcon class="h-4 w-4" mode="dark" />
    </a>
  </div>
  <div class="shrink grow flex gap-1 sm:gap-4">
    <slot />
    <div
      class="grow flex bg-black justify-center items-center px-4 rounded-full"
    >
      <DoubleSlider
        on:change={changeDate}
        bind:firstDate={startDate}
        bind:lastDate={endDate}
        config={{
          hoverTitles: true,
          rounded: true,
          backgroundColor: "bg-primary-900/75",
          foregroundColor: "bg-primary-500",
        }}
      />
    </div>
  </div>
  <Navigator />
</aside>
