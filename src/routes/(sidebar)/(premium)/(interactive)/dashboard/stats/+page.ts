import type { PageLoad } from "../$types";

import { getDashboardMetrics } from "$lib/common/elasticsearch/aggregations";
import { queryCVEs, queryClustersById } from "$lib/common/queryArticles";

export const load: PageLoad = async ({ parent, fetch }) => {
  const { startDate, endDate } = await parent();

  const metrics = await getDashboardMetrics(startDate, endDate);

  const clusters = queryClustersById(
    metrics.aggs.clusters.buckets.map(({ key }) => key),
    false,
    false,
    10000,
    fetch
  );

  const cveIds = metrics.aggs.cves.buckets.map(({ key }) => key);
  const cves = queryCVEs({ cves: cveIds, limit: 10000 }, false, fetch).then(
    ({ documents }) => documents ?? []
  );

  return {
    metrics,
    clusters,
    cves,
  };
};
