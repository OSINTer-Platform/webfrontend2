<script lang="ts">
    import Sidebar from '$com/sidebar/linkList.svelte';

    import { fullArticles } from '$shared/state';
    import type { SidebarOption } from '$shared/nav';

    let option: SidebarOption;
    $: option = {
        id: 'articles',
        list: Object.values($fullArticles).map((article) => ({
            href: `/article/${article.id}`,
            label: article.title,
        })),
    };
</script>

<Sidebar options={[option]} />
<slot />
