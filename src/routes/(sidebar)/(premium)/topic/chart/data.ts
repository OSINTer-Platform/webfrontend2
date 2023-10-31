import type { Cluster } from "$shared/types/api";

import * as d3 from "d3";

export type ClusterWithDate = Omit<Cluster, "dating"> & { dating: Date[] };
export type Point = { cluster: ClusterWithDate; x: number; y: number };

export async function clusterToLineData(
  cluster: ClusterWithDate,
  scaleX: d3.ScaleTime<number, number, never>,
  scaleY: d3.ScaleLinear<number, number, never>
): Promise<[number, number][]> {
  const lineData: [number, number][] = cluster.dating.map((date, index) => [
    scaleX(date),
    scaleY(index),
  ]);
  lineData.push([scaleX(new Date()), scaleY(cluster.dating.length - 1)]);
  return lineData;
}

export async function getPathPoints(
  clusters: ClusterWithDate[],
  scaleX: d3.ScaleTime<number, number, never>,
  scaleY: d3.ScaleLinear<number, number, never>
): Promise<Point[]> {
  const lineGen = d3.line().curve(d3.curveBundle.beta(0.7));

  const createPath = (data: string) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
    el.setAttributeNS(null, "d", data);
    return el;
  };

  async function pathToPoints(
    cluster: ClusterWithDate,
    path: SVGPathElement
  ): Promise<Point[]> {
    const totalLength = path.getTotalLength();
    const precision = totalLength / 100;

    const points: Point[] = [];

    for (
      let sampleLength = 0;
      sampleLength <= totalLength;
      sampleLength += precision
    ) {
      const sample = path.getPointAtLength(sampleLength);
      points.push({ cluster, x: sample.x, y: sample.y });
    }

    return points;
  }

  const points: Point[] = [];

  for (const cluster of clusters) {
    const lineData = await clusterToLineData(cluster, scaleX, scaleY);
    const path = createPath(lineGen(lineData) ?? "");
    const newPoints = await pathToPoints(cluster, path);
    points.push(...newPoints);
  }

  return points;
}
