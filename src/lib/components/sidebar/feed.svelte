<script lang="ts">
    import AppSwitcher from './appSwitcher.svelte';

    import LinkNavShell from './linkNav/shell.svelte';
    import LinkNavOptions from './linkNav/optionList.svelte';

    import SidebarShell from './shell.svelte';

    import type { ItemBase } from '$shared/types';
    import type { SidebarOption } from '$shared/nav';

    export let feeds: Array<ItemBase> = [];
    export let collections: Array<ItemBase> = [];
    export let clusters: Array<ItemBase> = [];

    $: showSidebar = feeds.length + collections.length + clusters.length > 0;

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

<SidebarShell>
    <AppSwitcher />

    {#if showSidebar}
        <LinkNavShell>
            {#each options as option}
                {#if option.list.length > 0}
                    <LinkNavOptions options={option} />
                {/if}
            {/each}
        </LinkNavShell>
    {/if}
</SidebarShell>
