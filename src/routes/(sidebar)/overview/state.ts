import {
  writableWithDefault,
  type WritableWithDefault,
} from "$lib/common/customStores";
import type { MLArticle } from "$shared/types/api";
import * as d3 from "d3";
import {
  derived,
  get,
  writable,
  type Readable,
  type Writable,
} from "svelte/store";
import { scaleCoords } from "./drawing";
import { detectCloseArticles, detectSelectedArticles } from "./events";

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

// Variables written to from event handlers
export const mapDimensions: Writable<{ height: number; width: number }> =
  writable({
    height: 0,
    width: 0,
  });

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

// Stores derived from scaled articles and state Stores
export const articles: Writable<MLArticle[]> = writable([]);

export const scaledArticles = derived(
  [articles, mapDimensions],
  ([$articles, $mapDimensions]) => {
    return scaleCoords($articles, $mapDimensions.width, $mapDimensions.height);
  }
);

export const selectedArticles = derived(
  [selectionBoundaries.start, selectionBoundaries.end, scaledArticles],
  ([$start, $end, $scaledArticles]) => {
    if ($start && $end) {
      return detectSelectedArticles($start, $end, $scaledArticles);
    }
    return [];
  }
);

export const closeArticles = derived(
  [mouseX, mouseY, mapTransform, scaledArticles],
  ([$mouseX, $mouseY, $mapTransform, $scaledArticles]) => {
    return detectCloseArticles(
      $mouseX.translated,
      $mouseY.translated,
      $mapTransform.k,
      $scaledArticles
    );
  }
);

export const toolTips = derived(closeArticles, ($closeArticles) => {
  const titles: string[] = [];

  $closeArticles.slice(0, 10).forEach((a) => {
    titles.push(a.article.title);
  });

  return titles;
});

// D3 related
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
