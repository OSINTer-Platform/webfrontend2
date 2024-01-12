import { client, extractDocHits } from "./common";

export interface TermAgg {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: Array<{
    key: string;
    doc_count: number;
  }>;
}

export interface SignificantTermAgg {
  doc_count: number;
  bg_count: number;
  buckets: Array<{
    key: string;
    doc_count: number;
    bg_count: number;
    score: number;
  }>;
}

export async function getDashboardMetrics(
  startDate: Date,
  endDate: Date,
  metricCount: number = 50
): Promise<{
  cves: TermAgg;
  sources: TermAgg;
  new_tags: SignificantTermAgg;
  clusters: SignificantTermAgg;
  articles: Array<{
    title: string;
    id: string;
    read_times: number;
  }>;
}> {
  const request = client();

  // For most commonly read articles
  request.addParameter("limit", metricCount);
  request.addParameter("sort_by", "read_times");
  request.addParameter("include_fields", ["title", "read_times"]);

  request.addParameter("first_date", startDate.toISOString());
  request.addParameter("last_date", endDate.toISOString());
  request.addParameter("aggregations", {
    cves: {
      terms: {
        field: "tags.interesting.values",
        size: metricCount,
        include: "CVE.*",
      },
    },
    sources: {
      terms: {
        field: "source",
        size: 1000,
      },
    },
    new_tags: {
      significant_terms: {
        field: "tags.automatic",
        size: metricCount,
      },
    },
    clusters: {
      significant_terms: {
        field: "ml.cluster",
        size: metricCount,
        include: "..*",
      },
    },
  });

  const response = await request.search();

  return {
    ...response.aggregations,
    articles: extractDocHits(response),
  } as any;
}
