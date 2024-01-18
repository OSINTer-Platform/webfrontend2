import type { Line } from "./data";

import * as d3 from "d3";

export async function drawLines(
  lines: Line[],
  hoveredLineTitles: string[],
  ctx: null | CanvasRenderingContext2D,
  pointerStatus: Line | null = null
) {
  const lineGen = d3.line().curve(d3.curveBundle.beta(0.7));

  function getStrokeColor(selected: boolean): string {
    return selected ? "rgba(191, 20, 54, 1)" : "rgba(100, 100, 100, 1)";
  }

  function drawLine(
    ctx: CanvasRenderingContext2D,
    data: { x: number; y: number }[],
    selected: boolean
  ) {
    ctx.strokeStyle = getStrokeColor(selected);
    ctx.beginPath();
    lineGen.context(ctx)(data.map(({ x, y }) => [x, y]));
    ctx.stroke();
    ctx.closePath();
  }
  if (!ctx) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.lineWidth = 2;

  const hoveredLines =
    hoveredLineTitles.length > 0
      ? lines.filter((l) => hoveredLineTitles.includes(l.title))
      : [];
  const highlight = Boolean(pointerStatus) || hoveredLines.length > 0;

  lines.forEach((line) => drawLine(ctx, line.points, !highlight));

  if (pointerStatus) drawLine(ctx, pointerStatus.points, true);
  hoveredLines.forEach((line) => drawLine(ctx, line.points, true));
}
