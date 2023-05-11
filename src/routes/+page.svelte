<script lang="ts">
    import InternalLinks from '$com/frontpage/internalLinks.svelte';
    import { config } from '$shared/config';
</script>

<svelte:head>
    <title>OSINTer</title>
    <meta property="og:title" content="OSINTer - The one-stop shop for CTI" />
    <meta
        property="og:description"
        content="Helping companies, organisations and individuals tackle the cyber-threats of tomorrow."
    />
    <meta property="og:image" content={config.images.fullLogo} />
    <meta property="og:url" content="https://osinter.dk/" />
    <meta property="og:type" content="website" />
</svelte:head>

<div class="overflow-y-auto">
    <header
        class="
		h-[36rem]
		w-full

		bg-surface-300
	"
    />

    <main
        class="
		bg-surface-100
		w-full
	"
    >
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InternalLinks />
        </section>
    </main>
</div>

<style lang="scss">
    section {
        @apply xl:max-w-6xl mx-auto
		p-4 sm:p-8 lg:p-12 xl:py-20;
    }
</style>
