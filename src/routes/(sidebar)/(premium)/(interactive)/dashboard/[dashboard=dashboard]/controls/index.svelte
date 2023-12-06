<script lang="ts">
  import LogoIcon from "$assets/LogoIcon.svelte";
  import DateSlider from "./dateSlider.svelte";
  import Navigator from "./navigator.svelte";

  export let startDate: Date;
</script>

<aside
  class="
  absolute

  bottom-2 left-2 right-2
  sm:bottom-4 sm:left-5 sm:right-5
  xl:left-10 xl:right-10
  2xl:left-20 2xl:right-20

  flex gap-1 sm:gap-4
  [&:hover>div]:opacity-100
"
>
  <div
    class="
    flex rounded-3xl overflow-hidden shrink-0

    bg-black opacity-5
    transition-color duration-300
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
  <DateSlider on:change bind:date={startDate} />
  <Navigator />
</aside>
