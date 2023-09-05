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
    d3Selection,
    d3Zoom,
  } from "./state";
  import { detectCloseArticles } from "./events";

  const { dotSize, toolTipSize, search, deepSearch } = controlParams;

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
      $dotSize,
      $search,
      $deepSearch,
      $mapTransform
    );

    if ($toolTips.length > 0)
      drawText(
        ctx,
        $toolTips,
        $mouseX.actual,
        $mouseY.actual,
        20,
        $toolTipSize
      );
  }

  onMount(() => {
    setTimeout(drawCanvas, 200);

    d3Selection.set(d3.select("#map"));

    $d3Selection?.on("mousemove", (event) =>
      detectCloseArticles(event, $mapTransform, $scaledArticles)
    );

    d3Zoom.set(
      d3
        .zoom<HTMLCanvasElement, unknown>()
        .scaleExtent([0.8, 16])
        .on("zoom", ({ transform }) => mapTransform.set(transform))
    );

    if ($d3Zoom) $d3Selection?.call($d3Zoom);
  });

  afterUpdate(drawCanvas);
</script>

<canvas id="map" height={$height} width={$width} />
