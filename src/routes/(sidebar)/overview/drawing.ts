import type { MLArticle } from "$shared/types/api";

import * as d3 from "d3";

export function drawArticlePoints(
  ctx: CanvasRenderingContext2D,
  articles: MLArticle[],
  canvasWidth: number,
  canvasHeight: number,
  pointSize: number,
  margin: number = 0.025
) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

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

  const clusterMax = d3.max(articles, (a) => a.ml.cluster) as number;
  const colorScale = d3
    .scaleSequential()
    .domain([0, clusterMax])
    .interpolator(d3.interpolateRainbow);

  articles.forEach((article) => {
    ctx.beginPath();

    ctx.fillStyle =
      article.ml.cluster >= 0 ? colorScale(article.ml.cluster) : "#ffffff";

    ctx.arc(
      xScale(article.ml.coordinates[0]),
      yScale(article.ml.coordinates[1]),
      pointSize,
      0,
      2 * Math.PI,
      true
    );

    ctx.fill();
  });
}
