<script lang="ts">
    import type { Post } from '$shared/types/blog';

    export let posts: Post[];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8 p-4">
    {#each posts as { title, description, image, route }}
        <a
            href={route}
            class="
			relative
			block

			border
			border-surface-300

			shadow-md

			w-full aspect-video

			overflow-hidden
			[&:hover>span]:blur-sm
			[&:hover>div]:opacity-40
			[&:hover>img]:blur-none

			hover:scale-105
			transition-transform
			duration-500
		"
        >
            <span
                class="absolute z-20 bottom-4 left-4 w-10/12 opacity-80 transition-[filter] duration-300"
            >
                <h4 class="text-xl xl:text-2xl font-bold text-white">
                    {title}
                </h4>
                <hr class="text-white/70 my-2" />
                <p
                    class="text-xs sm:text-lg md:text-base lg:text-lg text-white leading-tight"
                >
                    {description}
                </p>
            </span>

            <div
                class="
				bg-black
				opacity-70
				z-10
				
				h-full w-full absolute

				transition-opacity
				duration-300
				
			"
            />

            <img
                src={image}
                alt="Blog post"
                class="blur-sm transition-[filter] duration-300"
            />
        </a>
    {/each}
</div>
