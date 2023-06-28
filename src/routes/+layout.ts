import { PUBLIC_API_BASE } from "$env/static/public";
import { updatable } from "$lib/common/customStores";
import type { Collection, User } from "$shared/types/userItems";
import type { LayoutLoad } from "./$types";

export const load = (async ({ fetch, route }) => {
  const pagesWithSidebar = /^\/\(sidebar\)\/(\(app\)\/)?(feed|article).*/;

  const getUserObject = async (): Promise<User | null> => {
    const r = await fetch(`${PUBLIC_API_BASE}/auth/status`);
    return r.ok ? r.json() : null;
  };

  const user = await getUserObject();

  const updateCollectionList = async (): Promise<{
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

  return {
    user,

    userCollections: updatable(updateCollectionList),

    burgerMenu: route.id !== "/",
    customSidebar: route.id ? pagesWithSidebar.test(route.id) : false,
  };
}) satisfies LayoutLoad;
