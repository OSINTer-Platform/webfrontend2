import * as d3 from "d3";
import { writable, type Writable } from "svelte/store";
export const controlParams: {
  size: Writable<number>;
  enableSearch: Writable<boolean>;
  deepSearch: Writable<boolean>;
  search: Writable<string>;
} = {
  size: writable(1),
  enableSearch: writable(true),
  deepSearch: writable(false),
  search: writable(""),
};

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

export const d3Selection: Writable<d3.Selection<
  HTMLCanvasElement,
  unknown,
  HTMLElement,
  any
> | null> = writable(null);

export const d3Zoom: Writable<d3.ZoomBehavior<
  HTMLCanvasElement,
  unknown
> | null> = writable(null);
