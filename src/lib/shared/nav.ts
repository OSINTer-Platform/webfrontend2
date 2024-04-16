import type { NavItem } from "$shared/types/internal";

import {
  faHome,
  faBullhorn,
  faRss,
  faNewspaper,
  faMagnifyingGlass,
  faSitemap,
  faQuestion,
  faArrowTrendUp,
  faChartSimple,
  faHandHoldingDollar,
  faBug,
} from "@fortawesome/free-solid-svg-icons/index";
import { sponsorLink } from "./config";

export const navItems: {
  [key in "information" | "lists" | "ml" | "external"]: Array<
    NavItem & { description: string }
  >;
} = {
  information: [
    {
      title: "Home",
      description: "The homepage for OSINTer",
      route: "/",
      icon: faHome,
    },
    {
      title: "Blog",
      description:
        "Blog which will contain updates on the direction for OSINTer",
      route: "/blog",
      icon: faBullhorn,
    },
    {
      title: "Dashboard",
      description: "Dashboard of news in OSINTer",
      route: "/dashboard",
      icon: faChartSimple,
    },
  ],
  lists: [
    {
      title: "Feeds",
      description: "Access one of the feeds integrated in OSINTer",
      route: "/feed",
      icon: faRss,
    },
    {
      title: "Articles",
      description: "Browse the articles you have previously viewed on OSINTer",
      route: "/article",
      icon: faNewspaper,
    },
    {
      title: "Search",
      description: "Create your own search-query to gain specific insights",
      route: "/search",
      icon: faMagnifyingGlass,
    },
    {
      title: "CVEs",
      description:
        "Keep up to date on the most recent CVE's represented in OSINTer",
      route: "/cve",
      icon: faBug,
    },
  ],
  ml: [
    {
      title: "Overview",
      description: "Get an overview of the articles in OSINTer using ML",
      route: "/overview",
      icon: faSitemap,
    },
    {
      title: "Topics",
      description: "Explore topics in OSINTer",
      route: "/topic",
      icon: faArrowTrendUp,
    },
    {
      title: "Assistant",
      description: "Ask questions about data in OSINTer",
      route: "/assistant",
      icon: faQuestion,
    },
  ],
  external: [
    {
      title: "Sponsor us",
      description: "Sponsor the open-source development of OSINTer",
      route: sponsorLink,
      icon: faHandHoldingDollar,
    },
  ],
};
