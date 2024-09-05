import { page } from "$app/stores";
import { get } from "svelte/store";
import { modalState } from "$shared/state/modals";
import { sanitizeQuery, updateItem } from "$lib/common/userItems";
import { invalidateAll } from "$app/navigation";
import { v4 as uuid } from "uuid";

import type { ArticleSearchQuery } from "$shared/types/api";
import type { SearchRestrictFields } from "$shared/types/internal";
import type { Feed } from "$shared/types/userItems";

export { default as spawnPaymentModal } from "./payment";

export function modifyFeed(feed: Feed) {
  const pageContents = get(page);
  const webhooks = get(pageContents.data.webhooks);

  let restrictFields: SearchRestrictFields | undefined = undefined;
  const hasWebhook = webhooks
    .map((w) => w.attached_feeds)
    .flat()
    .includes(feed._id);

  if (hasWebhook) {
    restrictFields = {
      sort_order: {
        disabled: true,
        text: "Can't modify sorting with webhooks attached",
      },
      sort_by: {
        disabled: true,
        text: "Can't modify sorting with webhooks attached",
      },
    };
  }

  const modalId = uuid();

  modalState.append({
    id: modalId,
    modalType: "search",
    modalContent: {
      searchText: "Update feed",
      searchAction: async (query: ArticleSearchQuery) => {
        await updateItem(feed._id, sanitizeQuery(query), "feed");
        await invalidateAll();
        modalState.remove(modalId);
      },
      query: feed,
      restrictFields,
    },
  });
}
