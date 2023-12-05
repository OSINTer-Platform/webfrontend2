<script lang="ts">
  import DateSlider from "./dateSlider.svelte";

  export let startDate: Date;
</script>

<aside
  class="
  absolute bottom-4 left-20 right-20
  flex gap-4
  [&:hover>div]:opacity-100
"
>
  <DateSlider on:change date={startDate} />
</aside>
