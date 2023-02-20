import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import {
    faHome,
    faBullhorn,
    faRss,
    faDiagramProject,
    faNewspaper,
} from '@fortawesome/free-solid-svg-icons/index';

export type SidebarOption = {
    id: string;
    title: string;
    list: Array<{
        href: string;
        label: string;
        badge?: string;
    }>;
};

export type NavItem = {
    text: string;
    route: string;
    icon: IconDefinition;
};

export const navItems: { [key in 'external' | 'internal']: Array<NavItem> } = {
    external: [
        {
            text: 'Home',
            route: '/',
            icon: faHome,
        },
        {
            text: 'Blog',
            route: '/blog/',
            icon: faBullhorn,
        },
    ],
    internal: [
        {
            text: 'Feed',
            route: '/feed',
            icon: faRss,
        },
        {
            text: 'Article',
            route: '/article',
            icon: faNewspaper,
        },
        {
            text: 'Overview',
            route: '/ml',
            icon: faDiagramProject,
        },
    ],
};
