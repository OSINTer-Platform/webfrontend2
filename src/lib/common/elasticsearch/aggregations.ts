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

export async function getTags(
  startDate: Date,
  endDate: Date,
  selectedTags: string[],
  metricCount: number = 50
): Promise<{ tags: TermAgg; hitCount: number }> {
  const request = client();

  request.addParameter("limit", 0);
  request.addParameter("track_total", true);
  request.addParameter("first_date", startDate.toISOString());
  request.addParameter("last_date", endDate.toISOString());
  request.addParameter("aggregations", {
    tags: {
      terms: {
        field: "tags.automatic",
        size: metricCount,
      },
    },
  });

  if (selectedTags.length > 0)
    request.addParameter(
      "filters",
      selectedTags.map((tag) => ({ term: { "tags.automatic": tag } }))
    );

  const response = await request.search();

  const hitCount =
    typeof response.hits.total === "number"
      ? response.hits.total
      : response.hits.total?.value;

  return { tags: response.aggregations?.tags, hitCount } as any;
}

export async function getDashboardMetrics(
  startDate: Date,
  endDate: Date,
  metricCount: number = 50
): Promise<{
  global: {
    tags: TermAgg;
  };
  limited: {
    cves: TermAgg;
    sources: TermAgg;
    new_tags: SignificantTermAgg;
    clusters: SignificantTermAgg;
  };
  articles: Array<{
    title: string;
    url: string;
    id: string;
    read_times: number;
  }>;
}> {
  const request = client();

  // For most commonly read articles
  request.addParameter("limit", metricCount);
  request.addParameter("sort_by", "read_times");
  request.addParameter("include_fields", ["title", "read_times", "url"]);

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

  const globalRequest = client();
  globalRequest.addParameter("aggregations", {
    tags: {
      terms: {
        field: "tags.automatic",
        size: metricCount,
      },
    },
  });

  const responses = await Promise.all([
    globalRequest.search(),
    request.search(),
  ]);

  return {
    global: responses[0].aggregations,
    limited: responses[1].aggregations,
    articles: extractDocHits(responses[1]),
  } as any;
}
