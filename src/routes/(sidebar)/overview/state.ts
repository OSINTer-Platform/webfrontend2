import * as d3 from "d3";
import { writable, type Writable } from "svelte/store";

export const toolTips: Writable<string[]> = writable([]);
export const mouseX: Writable<{ actual: number; translated: number }> =
  writable({
    actual: 0,
    translated: 0,
  });
export const mouseY: Writable<{ actual: number; translated: number }> =
  writable({
    actual: 0,
    translated: 0,
  });
export const mapTransform: Writable<d3.ZoomTransform> = writable(
  d3.zoomIdentity
);
