<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';

    import { navItems } from '$shared/nav';
</script>

{#each navItems.internal as { title, description, route, icon }, i}
    <a
        href={route}
        class="
		relative

		mt-4
		sm:mt-8

		p-4
		xl:p-8
		md:mt-12
		md:mb-4
		xl:mt-16
		xl:mb-8

		flex
		flex-col
		items-center
		text-center

		border
		border-surface-300
		bg-surface-200

		shadow-sm
		md:shadow-md

		hover:shadow-lg
		hover:bg-surface-100

		transition-all
		duration-300

		[&:hover>div>svg]:opacity-100
	"
    >
        <div
            class="
			flex justify-center items-center
			w-16 rounded-full aspect-square
			-mt-10 mb-2
			
			md:w-20 md:-mt-14

			xl:w-28
			xl:-mt-20 xl:mb-4

			drop-shadow-lg
			bg-primary-{600 + i * 100}

			text-white
		"
        >
            <Fa
                {icon}
                class="text-3xl opacity-80 transition-opacity duration-300"
            />
        </div>
        <h3 class="font-semibold text-4xl">{title}</h3>
        <p
            class="
			sm:text-lg
			xl:text-xl

			font-light

			leading-4
		"
        >
            {description}
        </p>
    </a>
{/each}
