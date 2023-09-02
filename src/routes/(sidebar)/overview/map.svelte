<script lang="ts">
  import { afterUpdate, onMount } from "svelte";

  import type { MLArticle } from "$shared/types/api";
  import { drawArticlePoints, scaleCoords } from "./drawing";

  import { derived, type Readable } from "svelte/store";

  export let size: number;
  export let search: string;
  export let deepSearch: boolean;

  export let articles: Readable<MLArticle[]>;
  export let width: Readable<number>;
  export let height: Readable<number>;

  const scaledArticles: Readable<MLArticle[]> = derived(
    [articles, width, height],
    ([$articles, $width, $height]) => {
      return scaleCoords($articles, $width, $height);
    }
  );

  function drawCanvas() {
    let canvas = document.getElementById("map") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    drawArticlePoints(ctx, $scaledArticles, size, search, deepSearch);
  }

  onMount(() => setTimeout(drawCanvas, 200));
  afterUpdate(drawCanvas);
</script>

<canvas id="map" height={$height} width={$width} />
