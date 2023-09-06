import type * as d3 from "d3";

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
