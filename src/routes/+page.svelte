<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

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
        <section>
            <div
                class="
				p-4

				flex
				items-center
				gap-8

				md:text-lg
				font-medium
				bg-primary-400/20
				border-4
				border-primary-800/20

				rounded-md
			"
            >
                <Fa
                    icon={faExclamationCircle}
                    class="text-3xl text-primary-800"
                />
                Do keep in mind that OSINTer 5.0 is still under development and testing,
                and stability may vary.
            </div>

            <hr class="" />

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InternalLinks />
            </div>

            <hr class="" />
        </section>
    </main>
</div>

<style lang="scss">
    hr {
        @apply text-surface-400/10 border-2;
    }

    section {
        @apply xl:max-w-6xl mx-auto
		p-4 sm:p-8 lg:p-12 xl:py-20
		space-y-12;
    }
</style>
