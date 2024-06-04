import { PUBLIC_API_BASE } from "$env/static/public";
import {
  cookieStore,
  backgroundUpdatable,
  listStore,
  documentCache,
  setLike,
} from "$lib/common/customStores";
import { config } from "$shared/config";
import { derived, get, writable, type Readable } from "svelte/store";
import type { AuthArea, MLAvailability, Survey } from "$shared/types/api";
import type { ArticleListRender } from "$shared/types/internal";
import type { Collection, User } from "$shared/types/userItems";
import type { LayoutLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { persisted } from "svelte-persisted-store";
import { queryArticlesById } from "$lib/common/queryArticles";

export const load: LayoutLoad = async ({ fetch, data, url }) => {
  const getUserObject = async (): Promise<User | null> => {
    const r = await fetch(`${PUBLIC_API_BASE}/my/user/`);
    return r.ok ? r.json() : null;
  };

  const getMlAvailability = async (): Promise<MLAvailability> => {
    const r = await fetch(`${PUBLIC_API_BASE}/ml/`);
    return r.ok
      ? r.json()
      : { cluster: false, map: false, elser: false, assistant: false };
  };

  const getAuthAreas = async (): Promise<{ [key: string]: AuthArea[] }> => {
    const r = await fetch(`${PUBLIC_API_BASE}/auth/allowed-areas`);
    const json = await r.json();
    if (r.ok) return json;
    else error(r.status, json.detail);
  };

  const getSubmittedSurveys = async (): Promise<Survey[]> => {
    const r = await fetch(`${PUBLIC_API_BASE}/surveys/?version=1`);
    return r.ok ? await r.json() : [];
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

  const userContents = await getUserObject();
  const user = writable(userContents);
  const [mlAvailability, authAreas, submittedSurveys, userCollections] =
    await Promise.all([
      getMlAvailability(),
      getAuthAreas(),
      getSubmittedSurveys(),
      backgroundUpdatable(() => updateCollectionList(userContents)),
    ]);

  const allowedAreas = derived(user, ($user) => {
    const areas = Object.entries(authAreas).find(
      ([level, _]) => level === $user?.payment.subscription.level
    );

    if (areas) return areas[1];
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
    submittedSurveys,
    user,
    readArticleIds: setLike(readArticleIds),
    readArticles,
    checkAuthorization,
    mlAvailability,
    userCollections,
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
    },
    stripe: {
      paymentIntentClientSecret: url.searchParams.get(
        "payment_intent_client_secret"
      ),
    },
  };
};
