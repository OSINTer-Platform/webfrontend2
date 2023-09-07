import * as d3 from "d3";

import type { PointerModes } from "./state";
import type { MLArticle } from "$shared/types/api";

export function scalePointerPosition(
  x: number,
  y: number,
  mapTransform: d3.ZoomTransform
): [number, number] {
  const px = (x - mapTransform.x) / mapTransform.k;
  const py = (y - mapTransform.y) / mapTransform.k;
  return [px, py];
}

export function detectCloseArticles(
  x: number,
  y: number,
  mapScale: number,
  scaledArticles: MLArticle[]
) {
  const closeArticles: Array<{
    article: MLArticle;
    distance: number;
  }> = [];

  scaledArticles.forEach((article) => {
    const dx = x - article.ml.coordinates[0];
    const dy = y - article.ml.coordinates[1];
    const d = dx * dx + dy * dy;

    if (d < 30 / mapScale)
      closeArticles.push({ article: article, distance: d });
  });

  closeArticles.sort((a, b) => {
    return b.distance - a.distance;
  });

  const titles: string[] = [];

  closeArticles.slice(0, 10).forEach((a) => {
    titles.push(a.article.title);
  });

  return titles;
}

export function detectSelectedArticles(
  start: { x: number; y: number },
  stop: { x: number; y: number },
  scaledArticles: MLArticle[]
): MLArticle[] {
  const selectedArticles: MLArticle[] = [];

  const maxX = Math.max(start.x, stop.x);
  const minX = Math.min(start.x, stop.x);

  const maxY = Math.max(start.y, stop.y);
  const minY = Math.min(start.y, stop.y);

  scaledArticles.forEach((article) => {
    if (
      maxX > article.ml.coordinates[0] &&
      article.ml.coordinates[0] > minX &&
      maxY > article.ml.coordinates[1] &&
      article.ml.coordinates[1] > minY
    ) {
      selectedArticles.push(article);
    }
  });

  return selectedArticles;
}

export function handlePointerModeChange(
  mode: PointerModes,
  canvasSelection: d3.Selection<
    HTMLCanvasElement,
    unknown,
    HTMLElement,
    unknown
  >,
  zoomBehavior: d3.ZoomBehavior<HTMLCanvasElement, unknown>,
  dragBehavior: d3.DragBehavior<HTMLCanvasElement, unknown, unknown>
) {
  if (mode === "select") {
    canvasSelection.on(".zoom", null);
    zoomBehavior.filter((event) => event.type === "wheel");

    canvasSelection.call(dragBehavior);
  } else if (mode === "pan") {
    canvasSelection.on(".drag", null);
    zoomBehavior.filter(d3.zoom().filter());
  }

  canvasSelection.call(zoomBehavior);
}
