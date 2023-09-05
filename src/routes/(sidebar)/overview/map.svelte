<script lang="ts">
  import * as d3 from "d3";

  import type { MLArticle } from "$shared/types/api";

  import { derived, type Readable } from "svelte/store";

  import { afterUpdate, onMount } from "svelte";
  import { drawArticlePoints, drawText, scaleCoords } from "./drawing";
  import {
    controlParams,
    toolTips,
    mouseX,
    mouseY,
    mapTransform,
  } from "./state";

  const { size, search, deepSearch } = controlParams;

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

    drawArticlePoints(
      ctx,
      $scaledArticles,
      $size,
      $search,
      $deepSearch,
      $mapTransform
    );

    if ($toolTips.length > 0)
      drawText(ctx, $toolTips, $mouseX.actual, $mouseY.actual);
  }

  onMount(() => {
    setTimeout(drawCanvas, 200);

    d3.select("#map").on("mousemove", (event: any) => {
      const px = (event.layerX - $mapTransform.x) / $mapTransform.k;
      const py = (event.layerY - $mapTransform.y) / $mapTransform.k;

      const closeArticles: Array<{
        article: MLArticle;
        distance: number;
      }> = [];

      $scaledArticles.forEach((article) => {
        const dx = px - article.ml.coordinates[0];
        const dy = py - article.ml.coordinates[1];
        const d = dx * dx + dy * dy;

        if (d < 30 / $mapTransform.k)
          closeArticles.push({ article: article, distance: d });
      });

      closeArticles.sort((a, b) => {
        return b.distance - a.distance;
      });

      const titles: string[] = [];

      closeArticles.slice(0, 10).forEach((a) => {
        titles.push(a.article.title);
      });

      toolTips.set(titles);
      mouseX.set({ actual: event.layerX, translated: px });
      mouseY.set({ actual: event.layerY, translated: py });
    });

    d3.select<HTMLCanvasElement, unknown>("#map").call(
      d3
        .zoom<HTMLCanvasElement, unknown>()
        .scaleExtent([0.8, 16])
        .on("zoom", ({ transform }) => mapTransform.set(transform))
    );
  });

  afterUpdate(drawCanvas);
</script>

<canvas id="map" height={$height} width={$width} />
