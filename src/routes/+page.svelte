<script lang="ts">
    import { ConicGradient } from '@skeletonlabs/skeleton';
    import type { ConicStop } from '@skeletonlabs/skeleton';

    const conicStops: ConicStop[] = [
        {
            label: 'Primary',
            color: 'rgb(var(--color-primary-500))',
            start: 0,
            end: 33,
        },
        {
            label: 'Secondary',
            color: 'rgb(var(--color-secondary-500))',
            start: 33,
            end: 66,
        },
        {
            label: 'Tertiary',
            color: 'rgb(var(--color-tertiary-500))',
            start: 66,
            end: 100,
        },
    ];
</script>

<ConicGradient stops={conicStops}>(caption)</ConicGradient>
