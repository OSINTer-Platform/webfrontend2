<script lang="ts">
    import type { SidebarOption } from '$shared/nav';

    import AppSwitcher from './compontents/appSwitcher.svelte';

    import LinkNavShell from './compontents/linkNav/shell.svelte';
    import LinkNavOptions from './compontents/linkNav/optionList.svelte';

    import SidebarShell from './compontents//shell.svelte';

    export let options: Array<SidebarOption> = [];
</script>

<SidebarShell>
    <svelte:fragment slot="nav">
        <AppSwitcher />
    </svelte:fragment>

    <svelte:fragment slot="content">
        {#if options.length > 0}
            <LinkNavShell>
                <slot name="top" />
                {#each options as option}
                    {#if option.list.length > 0}
                        <LinkNavOptions options={option} />
                    {/if}
                {/each}
                <slot name="bottom" />
            </LinkNavShell>
        {/if}
    </svelte:fragment>
</SidebarShell>
