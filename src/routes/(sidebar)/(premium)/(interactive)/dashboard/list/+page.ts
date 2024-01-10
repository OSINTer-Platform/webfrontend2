import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
  function getStartDate(): Date {
    const dateDefault = new Date(new Date().setDate(new Date().getDate() - 7));

    const queryTime = Date.parse(url.searchParams.get("startDate") ?? "");

    if (isNaN(queryTime)) return dateDefault;
    return new Date(queryTime);
  }

  return {
    startDate: getStartDate(),
  };
};
