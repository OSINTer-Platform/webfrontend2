import type { ArticleListRender } from "$shared/types/internal";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  function parseCookie(key: string, isBoolean: true): boolean | undefined;
  function parseCookie(key: string, isBoolean: false): any | undefined;
  function parseCookie(key: string, isBoolean: boolean) {
    const value = cookies.get(key, {
      decode: (s: string) => decodeURIComponent(s),
    });

    if (typeof value === "undefined") return undefined;
    try {
      const val = JSON.parse(value);

      if (isBoolean) return Boolean(val);
      else return val;
    } catch {
      return undefined;
    }
  }
  function getRenderMode(
    cookieVal: string | undefined
  ): ArticleListRender | undefined {
    const modes: Array<ArticleListRender> = ["large", "title"];

    if (modes.includes(cookieVal as any)) return cookieVal as ArticleListRender;
    else return undefined;
  }

  return {
    cookies: {
      showPaywallNotice:
        parseCookie("settings-showPaywallNotice", true) ?? true,
      paymentUpdate: parseCookie("remindMe-paymentUpdate", false),
      darkMode: parseCookie("settings-darkMode", true),
      listRenderMode: getRenderMode(
        parseCookie("settings-listRenderMode", false)
      ),
    },
  };
};
