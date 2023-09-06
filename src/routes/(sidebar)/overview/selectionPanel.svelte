<script lang="ts">
  import * as d3 from "d3";
  import { controlParams, d3Selection, d3Zoom } from "./state";

  const { dotSize, toolTipSize, deepSearch, search, enableSearch } =
    controlParams;

  function resetMap() {
    dotSize.reset(300);
    toolTipSize.reset(300);
    deepSearch.reset();
    search.reset();
    enableSearch.reset();

    if ($d3Zoom) {
      $d3Selection
        ?.transition()
        .duration(750)
        .call($d3Zoom.transform, d3.zoomIdentity);
    }
  }
</script>

<aside
  class="
  absolute z-20
  flex flex-col
  w-80 top-10 right-10 p-4
  border-surface-400 border
  bg-surface-500/30
"
>
  <button
    on:click={resetMap}
    class="
    btn py-2
    font-bold text-xl
    border-surface-400 border
    dark:bg-surface-600/80
  ">Reset</button
  >
</aside>
