import {
  writableWithDefault,
  type WritableWithDefault,
} from "$lib/common/customStores";
import * as d3 from "d3";
import { get, writable, type Writable } from "svelte/store";

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
  [key in "start" | "end"]: WritableWithDefault<null | {
    x: number;
    y: number;
  }>;
} = {
  start: writableWithDefault(null),
  end: writableWithDefault(null),
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

export function resetState() {
  controlParams.dotSize.reset(300);
  controlParams.toolTipSize.reset(300);
  controlParams.deepSearch.reset();
  controlParams.search.reset();
  controlParams.enableSearch.reset();

  selectionBoundaries.start.reset();
  selectionBoundaries.end.reset();

  const currentZoom = get(d3Zoom);

  if (currentZoom) {
    get(d3Selection)
      ?.transition()
      .duration(750)
      .call(currentZoom.transform, d3.zoomIdentity);
  }
}
