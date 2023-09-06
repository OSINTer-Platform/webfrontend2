import {
  writableWithDefault,
  type WritableWithDefault,
} from "$lib/common/customStores";
import type { MLArticle } from "$shared/types/api";
import * as d3 from "d3";
import { writable, type Writable } from "svelte/store";

export type PointerModes = "pan" | "select";

export const controlParams: {
  dotSize: WritableWithDefault<number>;
  toolTipSize: WritableWithDefault<number>;
  enableSearch: WritableWithDefault<boolean>;
  deepSearch: WritableWithDefault<boolean>;
  search: WritableWithDefault<string>;
  pointerMode: WritableWithDefault<PointerModes>;
} = {
  dotSize: writableWithDefault(1),
  toolTipSize: writableWithDefault(14),
  enableSearch: writableWithDefault(true),
  deepSearch: writableWithDefault(false),
  search: writableWithDefault(""),
  pointerMode: writableWithDefault("pan"),
};

export const toolTips: Writable<string[]> = writable([]);
export const selectedArticles: Writable<MLArticle[]> = writable([]);

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

export const selectionBoundaries: {
  [key in "start" | "end"]: Writable<null | { x: number; y: number }>;
} = {
  start: writable(null),
  end: writable(null),
};

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

export const d3Drag: Writable<d3.DragBehavior<
  HTMLCanvasElement,
  unknown,
  unknown
> | null> = writable(null);
