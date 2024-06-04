import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = ({ url }) => {
  const startDateDefault = new Date(
    new Date().setDate(new Date().getDate() - 7)
  );
  function getDate(key: string): Date | undefined {
    const queryTime = Date.parse(url.searchParams.get(key) ?? "");

    if (isNaN(queryTime)) return;
    return new Date(queryTime);
  }

  return {
    startDate: getDate("startDate") ?? startDateDefault,
    endDate: getDate("endDate") ?? new Date(),
    customSidebar: true,
    topbar: false,
    meta: {
      title: "Dashboards | OSINTer",
      description:
        "Get an overview of the threat-landscape using our dashboards",
    },
  };
};
