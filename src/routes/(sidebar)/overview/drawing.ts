import { searchInArticle } from "$lib/common/filter";
import type { MLArticle } from "$shared/types/api";

import * as d3 from "d3";

export function scaleCoords(
  articles: MLArticle[],
  canvasWidth: number,
  canvasHeight: number,
  margin: number = 0.025
) {
  const aspectRatio = canvasWidth / canvasHeight;
  const xMargin = margin;
  const yMargin = margin * aspectRatio;

  const xDomain = d3.extent(articles, (a) => a.ml.coordinates[0]) as [
    number,
    number
  ];
  const xScale = d3
    .scaleLinear()
    .domain(xDomain)
    .range([canvasWidth * xMargin, canvasWidth * (1 - xMargin)]);

  const yDomain = d3.extent(articles, (a) => a.ml.coordinates[1]) as [
    number,
    number
  ];
  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([canvasHeight * (1 - yMargin), canvasHeight * yMargin]);

  const scaledArticles: MLArticle[] = [];

  articles.forEach((a) => {
    const scaledArticle: MLArticle = structuredClone(a);
    scaledArticle.ml.coordinates = [
      xScale(scaledArticle.ml.coordinates[0]),
      yScale(scaledArticle.ml.coordinates[1]),
    ];
    scaledArticles.push(scaledArticle);
  });

  return scaledArticles;
}

export function drawArticlePoints(
  ctx: CanvasRenderingContext2D,
  articles: MLArticle[],
  pointSize: number,
  search: string,
  deepSearch: boolean
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const clusterMax = d3.max(articles, (a) => a.ml.cluster) as number;
  const colorScale = d3
    .scaleSequential()
    .domain([0, clusterMax])
    .interpolator(d3.interpolateRainbow);

  articles.forEach((article) => {
    ctx.beginPath();

    if (search.length === 0 || searchInArticle(article, search, deepSearch)) {
      ctx.fillStyle =
        article.ml.cluster >= 0 ? colorScale(article.ml.cluster) : "#ffffff";
    } else {
      ctx.fillStyle = "rgba(120, 120, 120, 0.25)";
    }

    ctx.arc(
      article.ml.coordinates[0],
      article.ml.coordinates[1],
      pointSize,
      0,
      2 * Math.PI,
      true
    );

    ctx.fill();
  });
}
