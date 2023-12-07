import { dashboards, type Dashboards } from "$shared/types/internal";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
  function getDashboard(): Dashboards {
    function isDashboard(str: string | Dashboards): str is Dashboards {
      return dashboards.some((v) => v === str);
    }

    const dashboardDefault: Dashboards = "title";
    const param = url.searchParams.get("dashboard") ?? dashboardDefault;

    if (isDashboard(param)) {
      return param;
    } else {
      return dashboardDefault;
    }
  }

  return {
    dashboard: getDashboard(),
    customSidebar: true,
    topbar: false,
  };
};
