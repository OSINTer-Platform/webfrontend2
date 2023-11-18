import * as d3 from "d3";

import type { MLArticle } from "$shared/types/api";

export function scaleCoords(
  articles: MLArticle[],
  canvasWidth: number,
  canvasHeight: number,
  margin: number = 0.05
) {
  const startX = canvasWidth - (canvasWidth - canvasHeight) / 2;
  const stopX = canvasWidth - startX;

  const xDomain = d3.extent(articles, (a) => a.ml.coordinates[0]) as [
    number,
    number
  ];
  const xScale = d3.scaleLinear().domain(xDomain).range([startX, stopX]);

  const yDomain = d3.extent(articles, (a) => a.ml.coordinates[1]) as [
    number,
    number
  ];
  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([canvasHeight * (1 - margin), canvasHeight * margin]);

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

export function clearAndScale(
  ctxList: CanvasRenderingContext2D[],
  transform: d3.ZoomTransform
) {
  ctxList.forEach((ctx) => {
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);
  });
}

export function drawArticlePoints(
  ctx: CanvasRenderingContext2D,
  filteredArticles: { article: MLArticle; show: boolean }[],
  pointSize: number,
  darkMode: boolean,
  dotColor: null | string = null
) {
  const clusterMax = d3.max(
    filteredArticles,
    ({ article }) => article.ml.cluster
  ) as number;
  const colorScale = d3
    .scaleSequential()
    .domain([0, clusterMax])
    .interpolator(d3.interpolateRainbow);

  filteredArticles.forEach(({ article, show }) => {
    ctx.beginPath();

    if (dotColor) {
      ctx.fillStyle = dotColor;
    } else {
      if (show) {
        ctx.fillStyle =
          article.ml.cluster >= 0
            ? colorScale(article.ml.cluster)
            : darkMode
            ? "#ffffff"
            : "#000000";
      } else {
        ctx.fillStyle = "rgba(120, 120, 120, 0.25)";
      }
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

export function drawText(
  ctx: CanvasRenderingContext2D,
  texts: string[],
  px: number,
  py: number,
  darkMode: boolean,
  size: number = 14,
  distance: number = 20,
  innerPadding: number = 5,
  outerPadding: number = 10
) {
  ctx.font = `${size}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = darkMode ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.9)";

  const boxHeight =
    size * texts.length + outerPadding * 2 + innerPadding * (texts.length - 1);
  let boxWidth: number = 0;

  texts.forEach((text) => {
    const currentWidth = ctx.measureText(text).width;

    if (currentWidth > boxWidth) boxWidth = currentWidth;
  });

  boxWidth = boxWidth + 2 * outerPadding;

  let boxX: number = px - boxWidth / 2;
  let boxY: number = py - boxHeight - distance;

  if (px < boxWidth / 2) {
    boxX = px + distance;
    boxY = py - boxHeight / 2;
  } else if (ctx.canvas.width - px < boxWidth / 2) {
    boxX = px - boxWidth - distance;
    boxY = py - boxHeight / 2;
  }

  if (py < boxHeight * 1) boxY = py + distance;
  else if (ctx.canvas.height - py < boxHeight) boxY = py - boxHeight - distance;

  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

  ctx.fillStyle = darkMode ? "#ffffff" : "#000000";
  texts.forEach((text, i) =>
    ctx.fillText(
      text,
      boxX + outerPadding,
      boxY + size / 2 + outerPadding + i * (size + innerPadding)
    )
  );
}

export function drawSelectionBox(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  stop: { x: number; y: number }
) {
  const w = stop.x - start.x;
  const h = stop.y - start.y;

  ctx.fillStyle = `rgba(60, 60, 60, 0.5)`;
  ctx.fillRect(start.x, start.y, w, h);

  ctx.strokeStyle = "rgba(120, 120, 120)";
  ctx.strokeRect(start.x, start.y, w, h);
}
