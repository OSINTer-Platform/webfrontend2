import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
import type { NavItem } from "$shared/types/internal";

import {
  faHome,
  faBullhorn,
  faRss,
  faNewspaper,
  faMagnifyingGlass,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons/index";

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
  ],
  ml: [
    {
      title: "Overview",
      description: "Get an overview of the articles in OSINTer using ML",
      route: "/overview",
      icon: faSitemap,
    },
  ],
};
