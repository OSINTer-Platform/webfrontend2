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
  significant: false,
  selectedTags: string[],
  metricCount?: number
): Promise<{ tags: TermAgg; hitCount: number }>;
export async function getTags(
  startDate: Date,
  endDate: Date,
  significant: true,
  selectedTags: string[],
  metricCount?: number
): Promise<{ tags: SignificantTermAgg; hitCount: number }>;
export async function getTags(
  startDate: Date,
  endDate: Date,
  significant: boolean,
  selectedTags: string[],
  metricCount: number = 50
): Promise<{ tags: TermAgg | SignificantTermAgg; hitCount: number }> {
  const request = client();

  request.addParameter("limit", 0);
  request.addParameter("track_total", true);
  request.addParameter("first_date", startDate.toISOString());
  request.addParameter("last_date", endDate.toISOString());

  if (significant)
    request.addParameter("aggregations", {
      tags: {
        significant_terms: {
          field: "tags.automatic",
          size: metricCount,
        },
      },
    });
  else
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
  metricCount: number = 50,
  articleCount: number | null = null
): Promise<{
  aggs: {
    cves: TermAgg;
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
  request.addParameter("limit", articleCount ?? metricCount);
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

  const responses = await Promise.all([request.search()]);

  return {
    aggs: responses[0].aggregations,
    articles: extractDocHits(responses[0]),
  } as any;
}
