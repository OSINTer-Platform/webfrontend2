<script lang="ts">
    import LinkList from '$com/sidebar/linkList.svelte';

    import type { ItemBase } from '$shared/types/userItems';
    import type { SidebarOption } from '$shared/types/internal';

    import { inbuiltFeeds } from '$shared/config';

    export let feeds: Array<ItemBase> = [];
    export let collections: Array<ItemBase> = [];
    export let clusters: Array<ItemBase> = [];

    function convertToOption(
        items: Array<ItemBase>
    ): Array<{ href: string; label: string }> {
        return items.map((item) => ({
            href: `/feed/${item._id}`,
            label: item.name,
        }));
    }

    let options: Array<SidebarOption>;
    $: options = [
        {
            id: 'inbuilts',
            list: Object.values(inbuiltFeeds).map(({ title, id }) => ({
                href: `/feed/${id}`,
                label: title,
            })),
        },
        {
            id: 'feeds',
            title: 'Your feeds',
            list: convertToOption(feeds),
        },
        {
            id: 'collections',
            title: 'Your collections',
            list: convertToOption(collections),
        },
        {
            id: 'clusters',
            title: 'Current clusters',
            list: convertToOption(clusters),
        },
    ];
</script>

<LinkList {options} />
