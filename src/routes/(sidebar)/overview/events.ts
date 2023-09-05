import type * as d3 from "d3";

import { mouseX, mouseY, toolTips } from "./state";
import type { MLArticle } from "$shared/types/api";

export function detectCloseArticles(
  event: any,
  mapTransform: d3.ZoomTransform,
  scaledArticles: MLArticle[]
) {
  const px = (event.layerX - mapTransform.x) / mapTransform.k;
  const py = (event.layerY - mapTransform.y) / mapTransform.k;

  const closeArticles: Array<{
    article: MLArticle;
    distance: number;
  }> = [];

  scaledArticles.forEach((article) => {
    const dx = px - article.ml.coordinates[0];
    const dy = py - article.ml.coordinates[1];
    const d = dx * dx + dy * dy;

    if (d < 30 / mapTransform.k)
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
}
