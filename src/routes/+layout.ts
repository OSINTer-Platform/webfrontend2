import { PUBLIC_API_BASE } from "$env/static/public";
import {
  cookieStore,
  backgroundUpdatable,
  documentCache,
  setLike,
} from "$lib/common/customStores";
import { derived, writable, type Readable } from "svelte/store";
import type { AppStats, AuthArea, WebhookLimits } from "$shared/types/api";
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
    const allowed: AuthArea[] = [];
    const subscriptionAreas = Object.entries(appStats.auth.allowed_areas).find(
      ([level, _]) => level === $user?.payment.subscription.level
    );

    if (subscriptionAreas) allowed.push(...subscriptionAreas[1]);
    if ($user?.premium.status)
      allowed.push(...appStats.auth.allowed_areas.premium);
    if ($user?.enterprise)
      allowed.push(...appStats.auth.allowed_areas.enterprise);

    return [...new Set(allowed)];
  });

  const webhookLimits = derived(user, ($user) => {
    const baseLimits: WebhookLimits = { max_count: 0, max_feeds_per_hook: 0 };
    const addLimits = (limits: WebhookLimits) => {
      baseLimits.max_count = Math.max(baseLimits.max_count, limits.max_count);
      baseLimits.max_feeds_per_hook = Math.max(
        baseLimits.max_feeds_per_hook,
        limits.max_feeds_per_hook
      );
    };

    if ($user?.premium.status) addLimits(appStats.auth.webhook_limits.premium);
    if ($user?.enterprise) addLimits(appStats.auth.webhook_limits.enterprise);

    const limits = Object.entries(appStats.auth.webhook_limits).find(
      ([level, _]) => level === $user?.payment.subscription.level
    );

    if (limits) addLimits(limits[1]);

    return baseLimits;
  });

  const checkAuthorization: Readable<(area: AuthArea) => boolean> = derived(
    allowedAreas,
    ($allowedAreas) => {
      return (area: AuthArea) => $allowedAreas.includes(area);
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
