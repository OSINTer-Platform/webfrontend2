import type { WritableWithDefault } from "$lib/common/customStores";
import type { ClusterBase, MLArticle } from "$shared/types/api";
import type { Writable } from "svelte/store";

import * as d3 from "d3";
import { derived, get, writable } from "svelte/store";

import { writableWithDefault } from "$lib/common/customStores";

import { scaleCoords } from "./drawing";
import { detectCloseArticles, detectSelectedArticles } from "./events";
import { searchInArticle } from "$lib/common/filter";

export type PointerModes = "pan" | "select";

export const controlParams: {
  dotSize: WritableWithDefault<number>;
  toolTipSize: WritableWithDefault<number>;
  enableSearch: WritableWithDefault<boolean>;
  deepSearch: WritableWithDefault<boolean>;
  articleSearch: WritableWithDefault<string>;
  pointerMode: WritableWithDefault<PointerModes>;
  selectedSearch: WritableWithDefault<string>;
  showAllSelected: WritableWithDefault<boolean>;
  selectedSources: WritableWithDefault<string[]>;
  selectedClusters: WritableWithDefault<string[]>;
} = {
  dotSize: writableWithDefault(1),
  toolTipSize: writableWithDefault(14),
  enableSearch: writableWithDefault(true),
  deepSearch: writableWithDefault(false),
  articleSearch: writableWithDefault(""),
  pointerMode: writableWithDefault("pan"),
  selectedSearch: writableWithDefault(""),
  showAllSelected: writableWithDefault(false),
  selectedSources: writableWithDefault([]),
  selectedClusters: writableWithDefault([]),
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

function filterArticles(
  article: MLArticle,
  search: string,
  deepSearch: boolean,
  sources: string[],
  clusters: string[]
) {
  if (search.length > 0 && !searchInArticle(article, search, deepSearch))
    return false;
  else if (sources.length > 0 && !sources.includes(article.profile))
    return false;
  else if (clusters.length > 0 && !clusters.includes(article.ml.cluster))
    return false;

  return true;
}

// Stores derived from scaled articles and state Stores
export const articles: Writable<MLArticle[]> = writable([]);
export const clusters: Writable<ClusterBase[]> = writable([]);

export const articleProfiles = derived(articles, ($articles) => [
  ...new Set($articles.map((a) => a.profile).sort()),
]);

export const clusterNumbers = derived(clusters, ($clusters) =>
  Object.fromEntries($clusters.map((cluster) => [cluster.id, cluster.nr]))
);

export const scaledArticles = derived(
  [articles, mapDimensions],
  ([$articles, $mapDimensions]) => {
    return scaleCoords($articles, $mapDimensions.width, $mapDimensions.height);
  }
);

export const articleFilter = derived(
  [
    controlParams.articleSearch,
    controlParams.deepSearch,
    controlParams.selectedSources,
    controlParams.selectedClusters,
    scaledArticles,
  ],
  ([
    $articleSearch,
    $deepSearch,
    $selectedSources,
    $selectedClusters,
    $scaledArticles,
  ]) =>
    $scaledArticles.map((article) => {
      return {
        article,
        show: filterArticles(
          article,
          $articleSearch,
          $deepSearch,
          $selectedSources,
          $selectedClusters
        ),
      };
    })
);

export const filteredArticles = derived(articleFilter, (articleFilter) =>
  articleFilter.filter(({ show }) => show).map(({ article }) => article)
);

export const selectedArticles = derived(
  [selectionBoundaries.start, selectionBoundaries.end, filteredArticles],
  ([$start, $end, $filteredArticles]) => {
    if ($start && $end) {
      return detectSelectedArticles($start, $end, $filteredArticles);
    }
    return [];
  }
);

export const searchedSelectedArticles = derived(
  [controlParams.selectedSearch, controlParams.deepSearch, selectedArticles],
  ([$selectedSearch, $deepSearch, $selectedArticles]) => {
    if ($selectedSearch.length === 0) return $selectedArticles;
    const filteredArticles: MLArticle[] = [];

    $selectedArticles.forEach((article) => {
      if (searchInArticle(article, $selectedSearch, $deepSearch)) {
        filteredArticles.push(article);
      }
    });

    return filteredArticles;
  }
);

export const closeArticles = derived(
  [mouseX, mouseY, mapTransform, filteredArticles],
  ([$mouseX, $mouseY, $mapTransform, $filter]) => {
    return detectCloseArticles(
      $mouseX.translated,
      $mouseY.translated,
      $mapTransform.k,
      $filter
    );
  }
);

export const toolTips = derived(
  [closeArticles, clusterNumbers],
  ([$closeArticles, $clusterNumbers]) => {
    const titles: string[] = [];

    $closeArticles.slice(0, 10).forEach((a) => {
      const clusterNr = $clusterNumbers[a.article.ml.cluster] ?? -1;
      titles.push(`${clusterNr}: ${a.article.title}`);
    });

    return titles;
  }
);

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
  controlParams.articleSearch.reset();
  controlParams.enableSearch.reset();
  controlParams.selectedSources.reset();
  controlParams.selectedClusters.reset();

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
