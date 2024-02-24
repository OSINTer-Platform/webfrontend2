import * as d3 from "d3";

export type Line = {
  id: string;
  title: string;
  points: Array<{
    x: number;
    y: number;
  }>;
};

export type Point = {
  x: number;
  y: number;
  line: Line;
};

export function getPathPoints(lines: Line[], precision: number = 50): Point[] {
  const lineGen = d3.line().curve(d3.curveBundle.beta(0.7));

  const createPath = (data: string) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
    el.setAttributeNS(null, "d", data);
    return el;
  };

  function pathToPoints(line: Line, path: SVGPathElement): Point[] {
    const totalLength = path.getTotalLength();
    const pieceLength = totalLength / precision;

    const points: Point[] = [];

    for (
      let sampleLength = 0;
      sampleLength <= totalLength;
      sampleLength += pieceLength
    ) {
      const sample = path.getPointAtLength(sampleLength);
      points.push({ line, x: sample.x, y: sample.y });
    }

    return points;
  }

  const points: Point[] = [];
  lines.forEach((line) => {
    const lineData = line.points.map(({ x, y }): [number, number] => [x, y]);
    const path = createPath(lineGen(lineData) ?? "");
    points.push(...pathToPoints(line, path));
  });

  return points;
}
