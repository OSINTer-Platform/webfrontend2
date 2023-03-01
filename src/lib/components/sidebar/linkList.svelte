<script lang="ts">
    import type { SidebarOption } from '$shared/nav';

    import AppSwitcher from './appSwitcher.svelte';

    import LinkNavShell from './linkNav/shell.svelte';
    import LinkNavOptions from './linkNav/optionList.svelte';

    import SidebarShell from './shell.svelte';

    export let options: Array<SidebarOption> = [];
</script>

<SidebarShell>
    <AppSwitcher />

    {#if options.length > 0}
        <LinkNavShell>
            {#each options as option}
                {#if option.list.length > 0}
                    <LinkNavOptions options={option} />
                {/if}
            {/each}
        </LinkNavShell>
    {/if}
</SidebarShell>
