import type { Inbuilt } from './types/internal';

type O = string | { [key: string]: O };
type OTop = { [key: string]: O };

export const config: OTop = {
    apiRoot: 'http://127.0.0.1:8000',
};

const daySeconds = 24 * 60 * 60 * 1000;
type Intervals = 'day' | 'week' | 'month';

const timeAgo: { [interval in Intervals]: Date } = {
    day: new Date(new Date().getTime() - daySeconds),
    week: new Date(new Date().getTime() - daySeconds * 7),
    month: new Date(new Date().getTime() - daySeconds * 30),
};

const timeUrl = (interval: Intervals) => {
    const params = new URLSearchParams({
        limit: '0',
        sort_by: 'publish_date',
        sort_order: 'desc',
        complete: 'false',
        first_date: timeAgo[interval].toISOString(),
    });

    return `${config.apiRoot}/articles/search?${params.toString()}`;
};

export const inbuiltFeeds: { [key: string]: Inbuilt } = {
    day: {
        id: 'day',
        title: 'Todays news',
        desc: 'All the news available from the last 24 hours',
        url: timeUrl('day'),
    },
    week: {
        id: 'week',
        title: 'Last week',
        desc: 'All the news available from the last 7 days',
        url: timeUrl('week'),
    },
    month: {
        id: 'month',
        title: 'Last month',
        desc: 'All the news available from the last 30 days',
        url: timeUrl('month'),
    },
};
