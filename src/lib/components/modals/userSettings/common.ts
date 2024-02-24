import { invalidate } from "$app/navigation";
import { page } from "$app/stores";
import { get } from "svelte/store";

export async function updateUser(
  url: string,
  successMsg?: string,
  params?: RequestInit
): Promise<string> {
  const r = await fetch(url, params);

  if (r.ok) {
    const response = await r.json();
    const userStore = get(page).data.user;
    userStore.set(response);

    return successMsg ?? "Successfully updated user";
  } else {
    if (r.status == 401) invalidate((url) => url.pathname.includes("/my/user"));

    const response = await r.json();
    throw response["detail"] ?? "An unknown error occurred";
  }
}
