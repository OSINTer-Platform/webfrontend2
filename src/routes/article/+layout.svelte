<script lang="ts">
    import Sidebar from '$com/sidebar/linkList.svelte';

    import type { SidebarOption } from '$shared/nav';


    import { filteredArticles } from '$state/storedArticles';
    import { localSearch } from '$state/storedArticles';

    let option: SidebarOption;
    $: option = {
        id: 'articles',
        list: $filteredArticles.map((article) => ({
            href: `/article/${article.id}`,
            label: article.title,
        })),
    };
</script>

<Sidebar options={[option]} />
<main
    class="
		flex
		flex-col
		grow

		items-stretch
		overflow-y-auto
		overflow-x-hidden

		bg-surface-50
	"
>
    <slot />
</main>
