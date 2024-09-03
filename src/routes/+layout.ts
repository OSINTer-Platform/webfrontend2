import { PUBLIC_API_BASE } from "$env/static/public";
import {
  cookieStore,
  backgroundUpdatable,
  documentCache,
  setLike,
} from "$lib/common/customStores";
import { derived, writable, type Readable } from "svelte/store";
import type { AppStats, AuthArea } from "$shared/types/api";
import type { ArticleListRender } from "$shared/types/internal";
import type { Collection, User, Webhook } from "$shared/types/userItems";
import type { LayoutLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { persisted } from "svelte-persisted-store";
import { queryArticlesById } from "$lib/common/queryArticles";

export const load: LayoutLoad = async ({ fetch, data, url }) => {
  const getUserObject = async (): Promise<User | null> => {
    const r = await fetch(`${PUBLIC_API_BASE}/my/user/`);
    return r.ok ? r.json() : null;
  };

  const getAppStats = async (): Promise<AppStats> => {
    const r = await fetch(`${PUBLIC_API_BASE}/app-stats`);
    if (r.ok) return r.json();
    else error(r.status, (await r.json())["detail"]);
  };

  const updateCollectionList = async (
    user: User | null
  ): Promise<{
    [key: string]: Collection;
  }> => {
    if (!user) return {};

    const rCollection = await fetch(`${PUBLIC_API_BASE}/my/collections/list`);
    if (!rCollection.ok) return {};

    const collections: { [key: string]: Collection } = await rCollection.json();

    return Object.fromEntries(
      Object.entries(collections).filter(
        ([_, collection]) => collection.owner == user._id
      )
    );
  };

  async function getWebhooks(): Promise<Webhook[]> {
    const r = await fetch(`${PUBLIC_API_BASE}/user-items/webhook/list`);
    if (r.ok) return r.json();
    else return [];
  }

  const userContents = await getUserObject();
  const user = writable(userContents);
  const [appStats, userCollections, webhooks] = await Promise.all([
    getAppStats(),
    backgroundUpdatable(() => updateCollectionList(userContents)),
    backgroundUpdatable(getWebhooks),
  ]);

  const allowedAreas = derived(user, ($user) => {
    const areas = Object.entries(appStats.auth.allowed_areas).find(
      ([level, _]) => level === $user?.payment.subscription.level
    );

    if (areas) return areas[1];
  });

  const webhookLimits = derived(user, ($user) => {
    if ($user?.premium.status) return appStats.auth.webhook_limits.premium;

    const limits = Object.entries(appStats.auth.webhook_limits).find(
      ([level, _]) => level === $user?.payment.subscription.level
    );

    return limits?.[1] ?? { max_count: 0, max_feeds_per_hook: 0 };
  });

  const checkAuthorization: Readable<(area?: AuthArea) => boolean> = derived(
    [user, allowedAreas],
    ([$user, $allowedAreas]) => {
      return (area?: AuthArea) => {
        if ($user?.premium && $user.premium.status) return true;
        else if (!area && Array.isArray($allowedAreas)) return true;
        else if (
          area &&
          Array.isArray($allowedAreas) &&
          $allowedAreas.includes(area)
        )
          return true;
        else return false;
      };
    }
  );

  const dateInAnHour = new Date();
  dateInAnHour.setHours(dateInAnHour.getHours() + 1);

  const readArticleIds = userContents
    ? writable(userContents.read_articles)
    : persisted<string[]>("readArticleIds", []);

  const updateReadArticles = userContents
    ? (ids: string[]) => {
        readArticleIds.update((content) => {
          const presentIds = content.filter((id) => !ids.includes(id));
          fetch(`${PUBLIC_API_BASE}/my/user/read-articles`, {
            method: "PUT",
            body: JSON.stringify(presentIds),
            headers: {
              "Content-Type": "application/json",
            },
          });

          return presentIds;
        });
      }
    : (ids: string[]) =>
        readArticleIds.update((content) =>
          content.filter((id) => !ids.includes(id))
        );

  const readArticles = documentCache(
    (ids: string[], sort: boolean) =>
      queryArticlesById(ids, sort, false, 10000, fetch),
    readArticleIds,
    updateReadArticles
  );

  return {
    user,
    readArticleIds: setLike(readArticleIds),
    readArticles,
    checkAuthorization,
    appStats,
    webhookLimits,
    userCollections,
    webhooks,
    customSidebar: false,
    meta: {
      title: {
        visual: "OSINTer",
        meta: "OSINTer - The one-stop shop for cybersecurity news",
      },
      description:
        "Helping companies, organisations and individuals tackle the cyber-threats of tomorrow",
    },
    remindMe: {
      paymentUpdate: cookieStore(
        "remindMe-paymentUpdate",
        data.cookies.paymentUpdate ?? 0
      ),
    },
    settings: {
      darkMode: cookieStore(
        "settings-darkMode",
        data.cookies.darkMode ?? userContents?.settings.dark_mode ?? true,
        { expires: dateInAnHour }
      ),
      renderExternal: writable(userContents?.settings.render_external ?? false),
      listRenderMode: cookieStore<ArticleListRender>(
        "settings-listRenderMode",
        data.cookies.listRenderMode ??
          userContents?.settings.list_render_mode ??
          "large",
        { expires: dateInAnHour }
      ),
      showPaywallNotice: cookieStore(
        "settings-showPaywallNotice",
        data.cookies.showPaywallNotice
      ),
    },
    stripe: {
      paymentIntentClientSecret: url.searchParams.get(
        "payment_intent_client_secret"
      ),
    },
  };
};
