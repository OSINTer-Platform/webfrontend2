import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type ArticleListRender = 'large' | 'title';

export interface Inbuilt {
    id: string;
    title: string;
    desc: string;
    url: URL;
}

export interface HeaderModOptions {
    text: string;
    icon: IconDefinition;
    action?: Function;
    route?: string;
}
