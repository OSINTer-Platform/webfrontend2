<script lang="ts">
  import * as d3 from "d3";

  import type { MLArticle } from "$shared/types/api";

  import { derived, type Readable } from "svelte/store";

  import { afterUpdate, onMount } from "svelte";
  import {
    clearAndScale,
    drawArticlePoints,
    drawText,
    scaleCoords,
  } from "./drawing";
  import {
    controlParams,
    toolTips,
    mouseX,
    mouseY,
    mapTransform,
    selectionBoundaries,
    d3Selection,
    d3Zoom,
    d3Drag,
    selectedArticles,
  } from "./state";
  import {
    detectCloseArticles,
    detectSelectedArticles,
    scalePointerPosition,
  } from "./events";

  const { dotSize, toolTipSize, search, deepSearch } = controlParams;

  const selectionStart = selectionBoundaries.start;
  const selectionEnd = selectionBoundaries.end;

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

    let overlayCanvas = document.getElementById(
      "map-overlay"
    ) as HTMLCanvasElement;
    let overlayCtx = overlayCanvas.getContext("2d") as CanvasRenderingContext2D;

    clearAndScale([overlayCtx, ctx], $mapTransform);

    drawArticlePoints(ctx, $scaledArticles, $dotSize, $search, $deepSearch);

    ctx.restore();
    overlayCtx.restore();

    if ($toolTips.length > 0) {
      drawText(
        overlayCtx,
        $toolTips,
        $mouseX.actual,
        $mouseY.actual,
        20,
        $toolTipSize
      );
    }
  }

  function recordPointerPosition(x: number, y: number) {
    const [tx, ty] = scalePointerPosition(x, y, $mapTransform);
    mouseX.set({ actual: x, translated: tx });
    mouseY.set({ actual: y, translated: ty });
  }

  onMount(() => {
    setTimeout(drawCanvas, 200);

    d3Selection.set(d3.select("#map-overlay"));

    $d3Selection?.on("mousemove", (event) => {
      recordPointerPosition(event.layerX, event.layerY);

      toolTips.set(
        detectCloseArticles(
          $mouseX.translated,
          $mouseY.translated,
          $mapTransform.k,
          $scaledArticles
        )
      );
    });

    d3Zoom.set(
      d3
        .zoom<HTMLCanvasElement, unknown>()
        .scaleExtent([0.8, 16])
        .on("zoom", ({ transform }) => mapTransform.set(transform))
    );

    if ($d3Zoom) $d3Selection?.call($d3Zoom);
    d3Drag.set(
      d3
        .drag<HTMLCanvasElement, unknown>()
        .on("start", () => {
          selectionEnd.set(null);
          $selectedArticles = [];
          selectionStart.set({ x: $mouseX.translated, y: $mouseY.translated });
        })
        .on(
          "drag",
          (event: d3.D3DragEvent<HTMLCanvasElement, unknown, unknown>) => {
            recordPointerPosition(event.x, event.y);
            selectionEnd.set({ x: $mouseX.translated, y: $mouseY.translated });

            if ($selectionStart && $selectionEnd) {
              selectedArticles.set(
                detectSelectedArticles(
                  $selectionStart,
                  $selectionEnd,
                  $scaledArticles
                )
              );
            }
          }
        )
    );
  });

  afterUpdate(drawCanvas);
</script>

<canvas
  id="map-overlay"
  class="absolute z-10 top-0 bottom-0 right-0 left-0"
  height={$height}
  width={$width}
/>
<canvas
  id="map"
  class="absolute top-0 bottom-0 right-0 left-0"
  height={$height}
  width={$width}
/>
