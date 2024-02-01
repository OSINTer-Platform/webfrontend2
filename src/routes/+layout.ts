import { PUBLIC_API_BASE } from "$env/static/public";
import { updatable } from "$lib/common/customStores";
import type { MLAvailability } from "$shared/types/api";
import type { Collection, User } from "$shared/types/userItems";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
  const getUserObject = async (): Promise<User | null> => {
    const r = await fetch(`${PUBLIC_API_BASE}/auth/status`);
    return r.ok ? r.json() : null;
  };

  const getMlAvailability = async (): Promise<MLAvailability> => {
    const r = await fetch(`${PUBLIC_API_BASE}/ml/`);
    return r.ok
      ? r.json()
      : { clustering: false, map: false, elser: false, inference: false };
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

  const updateAlreadyRead = async (
    user: User | null
  ): Promise<Collection | null> => {
    if (!user) return null;

    const rCollection = await fetch(
      `${PUBLIC_API_BASE}/user-items/${user.already_read}/content`
    );
    if (!rCollection.ok) return null;

    return await rCollection.json();
  };

  const user = await getUserObject();
  const [mlAvailability, alreadyRead, userCollections] = await Promise.all([
    getMlAvailability(),
    updatable(() => updateAlreadyRead(user)),
    updatable(() => updateCollectionList(user)),
  ]);

  return {
    user,
    mlAvailability,
    alreadyRead,
    userCollections,
    customSidebar: false,
  };
};
