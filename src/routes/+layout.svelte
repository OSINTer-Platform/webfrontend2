<script lang="ts">
    import '@skeletonlabs/skeleton/themes/theme-crimson.css';
    import '@skeletonlabs/skeleton/styles/all.css';
    import '../app.css';

    import { AppShell } from '@skeletonlabs/skeleton';
    import TopBar from './topbar.svelte';
</script>

<AppShell>
    <svelte:fragment slot="header"><TopBar /></svelte:fragment>
    <slot />
</AppShell>
