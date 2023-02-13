import type { PageLoad } from './$types';

import { config } from '$shared/config'
import type { ArticleBase } from '$shared/types'

export const load = (({ params, fetch }) => {

	const fetchArticles = async ():Promise<ArticleBase[]> => {
		const r = await fetch(`${config.apiRoot}/user-items/${params.item_id}/articles`)
		const articles = await r.json()
		return articles
	}

	return {
		articles: fetchArticles(),
	};

}) satisfies PageLoad;
