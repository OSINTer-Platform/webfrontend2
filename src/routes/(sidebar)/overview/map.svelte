<script lang="ts">
  import * as d3 from "d3";

  import type { MLArticle } from "$shared/types/api";

  import type { Readable } from "svelte/store";

  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { darkMode } from "$state/state";
  import {
    clearAndScale,
    drawArticlePoints,
    drawSelectionBox,
    drawText,
  } from "./drawing";

  import {
    controlParams,
    mapDimensions,
    mouseX,
    mouseY,
    mapTransform,
    selectionBoundaries,
    articles as articleStore,
    scaledArticles,
    toolTips,
    d3Selection,
    d3Zoom,
    d3Drag,
  } from "./state";

  import { handlePointerModeChange, scalePointerPosition } from "./events";

  const storeListeners: Array<() => void> = [];

  const { dotSize, toolTipSize, articleSearch, deepSearch, pointerMode } =
    controlParams;

  const selectionStart = selectionBoundaries.start;
  const selectionEnd = selectionBoundaries.end;

  export let articles: Readable<MLArticle[]>;
  storeListeners.push(
    articles.subscribe((articleList) => articleStore.set(articleList))
  );

  function drawCanvas() {
    let canvas = document.getElementById("map") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let overlayCanvas = document.getElementById(
      "map-overlay"
    ) as HTMLCanvasElement;
    let overlayCtx = overlayCanvas.getContext("2d") as CanvasRenderingContext2D;

    clearAndScale([overlayCtx, ctx], $mapTransform);

    drawArticlePoints(
      ctx,
      $scaledArticles,
      $dotSize,
      $articleSearch,
      $deepSearch,
      $darkMode
    );

    if ($selectionStart && $selectionEnd) {
      drawSelectionBox(overlayCtx, $selectionStart, $selectionEnd, $darkMode);
    }

    ctx.restore();
    overlayCtx.restore();

    if ($toolTips.length > 0) {
      drawText(
        overlayCtx,
        $toolTips,
        $mouseX.actual,
        $mouseY.actual,
        $darkMode,
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

    $d3Selection?.on("mousemove", (event) =>
      recordPointerPosition(event.layerX, event.layerY)
    );

    d3Zoom.set(
      d3
        .zoom<HTMLCanvasElement, unknown>()
        .scaleExtent([0.8, 16])
        .on("zoom", ({ transform }) => mapTransform.set(transform))
    );

    d3Drag.set(
      d3
        .drag<HTMLCanvasElement, unknown>()
        .on("start", () => {
          selectionEnd.set(null);
          selectionStart.set({ x: $mouseX.translated, y: $mouseY.translated });
        })
        .on(
          "drag",
          (event: d3.D3DragEvent<HTMLCanvasElement, unknown, unknown>) => {
            recordPointerPosition(event.x, event.y);
            selectionEnd.set({ x: $mouseX.translated, y: $mouseY.translated });
          }
        )
    );

    storeListeners.push(
      pointerMode.subscribe((currentMode) => {
        if ($d3Selection && $d3Zoom && $d3Drag) {
          handlePointerModeChange(currentMode, $d3Selection, $d3Zoom, $d3Drag);
        }
      })
    );
  });

  onDestroy(() => {
    storeListeners.forEach((unsubscriber) => unsubscriber());
  });

  afterUpdate(() => requestAnimationFrame(drawCanvas));
</script>

<canvas
  id="map-overlay"
  class="absolute z-10 top-0 bottom-0 right-0 left-0"
  height={$mapDimensions.height}
  width={$mapDimensions.width}
/>
<canvas
  id="map"
  class="absolute top-0 bottom-0 right-0 left-0 bg-white/50 dark:bg-black/50"
  height={$mapDimensions.height}
  width={$mapDimensions.width}
/>
