import { clusterToLineData, type ClusterWithDate, type Point } from "./data";

import * as d3 from "d3";

export async function drawLines(
  clusters: ClusterWithDate[],
  ctx: null | CanvasRenderingContext2D,
  pointerStatus: Point | null = null,
  scaleX: d3.ScaleTime<number, number, never>,
  scaleY: d3.ScaleLinear<number, number, never>
) {
  const lineGen = d3.line().curve(d3.curveBundle.beta(0.7));

  function getStrokeColor(selected: boolean): string {
    return selected ? "rgba(191, 20, 54, 1)" : "rgba(100, 100, 100, 1)";
  }

  function drawLine(
    ctx: CanvasRenderingContext2D,
    data: [number, number][],
    selected: boolean
  ) {
    ctx.strokeStyle = getStrokeColor(selected);
    ctx.beginPath();
    lineGen.context(ctx)(data);
    ctx.stroke();
    ctx.closePath();
  }
  if (!ctx) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.lineWidth = 2;

  for (const cluster of clusters) {
    drawLine(
      ctx,
      await clusterToLineData(cluster, scaleX, scaleY),
      !Boolean(pointerStatus)
    );
  }

  if (pointerStatus)
    drawLine(
      ctx,
      await clusterToLineData(pointerStatus.cluster, scaleX, scaleY),
      true
    );
}
