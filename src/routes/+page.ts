import { getTags } from "$lib/common/elasticsearch/aggregations";
import { searchArticles } from "$lib/common/elasticsearch/search";
import { shuffle } from "$lib/common/sort";

import type { TrendingArticleBundle } from "$com/frontpage/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const tags = await getTags(oneMonthAgo, new Date(), true, [], 4);

  const trendingArticles: TrendingArticleBundle[] = await Promise.all(
    tags.tags.buckets.map(async ({ key, doc_count, bg_count }) => ({
      tag: key,
      count: doc_count + bg_count,
      articles: shuffle(
        await searchArticles(
          {
            limit: 6,
            sort_by: "",
            sort_order: "desc",
            search_term: key,
            highlight: true,
            first_date: oneMonthAgo.toISOString(),
          },
          { include_fields: ["title", "url", "image_url"] }
        )
      ),
    }))
  );

  return {
    trendingArticles,
    burgerMenu: false,
    topbar: false,
  };
};
