<script lang="ts">
  import * as d3 from "d3";
  import { afterUpdate, onMount } from "svelte";

  import type { MLArticle } from "$shared/types/api";
  import { drawArticlePoints, drawText, scaleCoords } from "./drawing";

  import {
    derived,
    writable,
    type Readable,
    type Writable,
  } from "svelte/store";

  export let size: number;
  export let search: string;
  export let deepSearch: boolean;

  export let articles: Readable<MLArticle[]>;
  export let width: Readable<number>;
  export let height: Readable<number>;

  let toolTips: Writable<string[]> = writable([]);
  let mouseX: Writable<number> = writable(0);
  let mouseY: Writable<number> = writable(0);

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

    if ($toolTips.length > 0) drawText(ctx, $toolTips, $mouseX, $mouseY);
  }

  onMount(() => {
    setTimeout(drawCanvas, 200);

    d3.select("#map").on("mousemove", (event: any) => {
      let px = event.layerX;
      let py = event.layerY;

      const closeArticles: Array<{
        article: MLArticle;
        distance: number;
      }> = [];

      $scaledArticles.forEach((article) => {
        const dx = px - article.ml.coordinates[0];
        const dy = py - article.ml.coordinates[1];
        const d = dx * dx + dy * dy;

        if (d < 100) closeArticles.push({ article: article, distance: d });
      });

      closeArticles.sort((a, b) => {
        return b.distance - a.distance;
      });

      const titles: string[] = [];

      closeArticles.slice(0, 5).forEach((a) => {
        titles.push(a.article.title);
      });

      toolTips.set(titles);
      mouseX.set(px);
      mouseY.set(py);
    });
  });

  afterUpdate(drawCanvas);
</script>

<canvas id="map" height={$height} width={$width} />
