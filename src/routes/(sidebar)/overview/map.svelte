<script lang="ts">
  import { afterUpdate, onMount } from "svelte";

  import type { MLArticle } from "$shared/types/api";
  import { drawArticlePoints } from "./drawing";

  export let mapData: Array<MLArticle>;
  export let size: number;
  export let search: string;
  export let deepSearch: boolean;

  export let width: number;
  export let height: number;

  function drawCanvas() {
    let canvas = document.getElementById("map") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    drawArticlePoints(ctx, mapData, width, height, size, search, deepSearch);
  }

  onMount(() => setTimeout(drawCanvas, 200));
  afterUpdate(drawCanvas);
</script>

<canvas id="map" {height} {width}><!-- dfsdf--></canvas>
