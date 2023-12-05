import type { PageLoad } from "./$types";
import type { Dashboards } from "$shared/types/internal";

export const load: PageLoad = async ({ params }) => {
  const dashboard = params.dashboard as Dashboards;

  return {
    dashboard,
    customSidebar: true,
    topbar: false,
  };
};
