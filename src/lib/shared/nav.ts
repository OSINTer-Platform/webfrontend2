import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import {
    faHome,
    faBullhorn,
    faRss,
    faDiagramProject,
    faNewspaper,
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons/index';

export type SidebarOption = {
    id: string;
    title?: string;
    list: Array<{
        href: string;
        label: string;
        badge?: string;
    }>;
};

export type NavItem = {
    title: string;
    description?: string;
    route: string;
    icon: IconDefinition;
};

export const navItems: { [key in 'external' | 'internal']: Array<NavItem> } = {
    external: [
        {
            title: 'Home',
            description: 'The homepage for OSINTer',
            route: '/',
            icon: faHome,
        },
        {
            title: 'Blog',
            description:
                'Blog which will contain updates on the direction for OSINTer',
            route: '/blog',
            icon: faBullhorn,
        },
    ],
    internal: [
        {
            title: 'Feeds',
            description: 'Access one of the feeds integrated in OSINTer',
            route: '/feed',
            icon: faRss,
        },
        {
            title: 'Articles',
            description:
                'Browse the articles you have previously viewed on OSINTer',
            route: '/article',
            icon: faNewspaper,
        },
        {
            title: 'Search',
            description:
                'Create your own search-query to gain specific insights',
            route: '/search',
            icon: faMagnifyingGlass,
        },
        /*
        {
            title: 'Overview',
            route: '/ml',
            icon: faDiagramProject,
        },
		*/
    ],
};
