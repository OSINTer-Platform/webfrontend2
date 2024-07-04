import type { NavItem } from "$shared/types/internal";

import {
  faHome,
  faBullhorn,
  faRss,
  faList,
  faSitemap,
  faQuestion,
  faArrowTrendUp,
  faChartSimple,
  faBug,
} from "@fortawesome/free-solid-svg-icons";

export const navItems: {
  [key in "information" | "lists" | "ml"]: Array<
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
      description: "Dashboard of news and trending topics in OSINTer",
      route: "/dashboard",
      icon: faChartSimple,
    },
  ],
  lists: [
    {
      title: "News",
      description: "Get the latest news from the cybersecurity sphere",
      route: "/news",
      icon: faRss,
    },
    {
      title: "Feeds",
      description: "Access one of your feeds in OSINTer",
      route: "/feed",
      icon: faList,
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
};
