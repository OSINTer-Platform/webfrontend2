<script lang="ts">
  import type { ClusterBase, MLArticle } from "$shared/types/api";
  import type { Readable } from "svelte/store";

  import * as d3 from "d3";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { darkMode, listElementCount } from "$state/state";
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
    clusters as clusterStore,
    articleFilter,
    filteredArticles,
    searchedSelectedArticles,
    toolTips,
    d3Selection,
    d3Zoom,
    d3Drag,
    closeArticles,
    clusterNumbers,
  } from "./state";

  import { handlePointerModeChange, scalePointerPosition } from "./events";

  const storeListeners: Array<() => void> = [];

  const { dotSize, toolTipSize, pointerMode } = controlParams;

  const selectionStart = selectionBoundaries.start;
  const selectionEnd = selectionBoundaries.end;

  export let articles: Readable<MLArticle[]>;
  export let clusters: ClusterBase[];

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
      $articleFilter,
      $clusterNumbers,
      $dotSize,
      $darkMode
    );

    if ($selectionStart && $selectionEnd) {
      drawSelectionBox(overlayCtx, $selectionStart, $selectionEnd);

      drawArticlePoints(
        overlayCtx,
        $searchedSelectedArticles.map((article) => ({ article, show: true })),
        $clusterNumbers,
        $dotSize,
        $darkMode,
        "#ffffff"
      );
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
    clusterStore.set(clusters);
    setTimeout(drawCanvas, 200);

    d3Selection.set(d3.select("#map-overlay"));

    $d3Selection?.on("mousemove", (event) =>
      recordPointerPosition(event.layerX, event.layerY)
    );

    $d3Selection?.on("click", () => {
      if ($closeArticles.length < 1) return;

      const clusters: { [key: string]: number } = {};

      for (const article of $closeArticles) {
        const cluster = article.article.ml.cluster.toString();
        clusters[cluster] = (clusters[cluster] ?? 0) + 1;
      }

      const primaryCluster = Object.entries(clusters).sort(
        (a, b) => b[1] - a[1]
      )[0][0];

      window.open(`/topic/${primaryCluster}`, "_blank");
    });

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

  $: listElementCount.set($filteredArticles.length);

  onDestroy(() => {
    storeListeners.forEach((unsubscriber) => unsubscriber());
    listElementCount.set(0);
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
