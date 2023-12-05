<script lang="ts">
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

  flex gap-4
  [&:hover>div]:opacity-100
"
>
  <DateSlider on:change date={startDate} />
  <Navigator />
</aside>
