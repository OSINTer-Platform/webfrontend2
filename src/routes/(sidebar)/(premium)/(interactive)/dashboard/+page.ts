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

  function getStartDate(): Date {
    const dateDefault = new Date(new Date().setDate(new Date().getDate() - 7));

    const queryTime = Date.parse(url.searchParams.get("startDate") ?? "");

    if (isNaN(queryTime)) return dateDefault;
    return new Date(queryTime);
  }

  return {
    startDate: getStartDate(),
    dashboard: getDashboard(),
    customSidebar: true,
    topbar: false,
  };
};
